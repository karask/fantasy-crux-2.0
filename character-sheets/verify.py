"""Verify final PDF structure, field geometry, rules coverage and saved values."""

import json
import subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

from PIL import Image, ImageDraw
from pypdf import PdfReader, PdfWriter
from reportlab.pdfbase.pdfmetrics import stringWidth

ROOT = Path(__file__).resolve().parents[1]
REVIEW = ROOT / 'character-sheets/review'
WORK = ROOT / 'tmp/pdfs/character-sheets'
MM = 72 / 25.4
EXPECTED_SKILLS = {
    'Dodge', 'Persistence', 'Resilience', 'Close Combat', 'Ranged Combat',
    'Unarmed Combat', 'Culture (own)', 'Culture (other)', 'Language (own)',
    'Language (other)', 'Natural Lore', 'Lore (own)', 'Lore (other)',
    'Athletics', 'Craft', 'Deception', 'Driving', 'Healing', 'Influence',
    'Mechanisms', 'Perception', 'Performance', 'Riding', 'Sailing',
    'Streetwise', 'Trade', 'Shaping *',
}


def widgets(reader):
    found = {}
    for index, page in enumerate(reader.pages, 1):
        for ref in page.get('/Annots', []):
            obj = ref.get_object()
            assert obj['/Subtype'] == '/Widget'
            assert obj['/T'] not in found, f"Duplicate widget: {obj['/T']}"
            found[obj['/T']] = (index, obj)
    return found


def check(manifest):
    path = ROOT / manifest['output']
    name = manifest['theme']['id']
    reader = PdfReader(path)
    fields = reader.get_fields()
    widget_map = widgets(reader)
    expected = {f['name'] for f in manifest['fields']}
    assert len(reader.pages) == 7
    assert set(fields) == set(widget_map) == expected
    assert len(reader.outline) == 7
    assert list(reader.attachments) == ['Open-Game-License-1.0a.md']
    assert reader.attachments['Open-Game-License-1.0a.md'][0] == (ROOT/'src/license.md').read_bytes()
    for page in reader.pages:
        assert abs(float(page.mediabox.width) / MM - 210) < .01
        assert abs(float(page.mediabox.height) / MM - 297) < .01
    for f in manifest['fields']:
        field = fields[f['name']]
        page, widget = widget_map[f['name']]
        assert page == f['page']
        assert field.get('/V', '') in ('', '/Off')
        assert widget.get('/V', '') == field.get('/V', '')
        assert int(widget.get('/F', 0)) & 4, 'Widget must print'
        assert '/AP' in widget and '/N' in widget['/AP']
        if f['kind'] == 'text':
            assert widget['/AP']['/N'].get_object().get_data()
        rect = list(map(float, widget['/Rect']))
        assert min(rect) >= 0
        assert rect[2] <= 210 * MM and rect[3] <= 297 * MM
        expected_rect=[f['x'],297-f['y']-f['h'],f['x']+f['w'],297-f['y']]
        assert all(abs(a/MM-b)<.01 for a,b in zip(rect,expected_rect))
    for i, a in enumerate(manifest['fields']):
        for b in manifest['fields'][i+1:]:
            if a['page'] != b['page']:
                continue
            iw = min(a['x']+a['w'], b['x']+b['w']) - max(a['x'], b['x'])
            ih = min(a['y']+a['h'], b['y']+b['h']) - max(a['y'], b['y'])
            assert iw <= .15 or ih <= .15, (a['name'], b['name'])
    skills_text = reader.pages[1].extract_text()
    for skill in EXPECTED_SKILLS:
        assert skill in skills_text, f'Missing skill: {skill}'
    assert skills_text.count('Craft') >= 4
    all_text = '\n'.join(page.extract_text() for page in reader.pages)
    for phrase in ['Committed PP', 'Available max PP', 'Active total', 'Permanent INT']:
        assert phrase.lower() in all_text.lower(), phrase
    assert all_text.count('COMMON SPELL / WORKING') == 4
    assert 'INT + POW' in skills_text
    for invalid in ('\ufffd', '\u25a0'):
        assert invalid not in all_text

    # Fill every field on every page, then reopen both logical data and widgets.
    samples = {}
    for f in manifest['fields']:
        key = f['name']
        samples[key] = '/Yes' if f['kind'] == 'check' else '7'
        if '.characteristics.' in key or '.resources.' in key:
            samples[key] = '18'
        if f.get('multi'):
            samples[key] = 'A short note for the next session.\nA second line remains editable.'
        if key.endswith('identity.name') or key.endswith('.character'):
            samples[key] = 'Rowan Ash'
        if '.talent.' in key and key.endswith('.effect'):
            samples[key] = "With a ready shield, apply the Talent's listed protection. Record its triggers, costs and limits."
        if '.spell.' in key and key.endswith('.name'):
            samples[key] = 'Shelter from the storm'
        if '.spell.' in key and key.endswith('.effect'):
            samples[key] = 'Describe the agreed outcome, who is affected and how long it lasts.\nRange: 15 metres.\nTargets: one traveller.\nKeep the complete rules reminder here.'
        if f.get('multi'):
            # PDF viewers wrap multiline fields themselves. pypdf's appearance
            # writer only honours explicit newlines, so wrap the QA value using
            # the actual field font and width before generating its appearance.
            font_size = float(widget_map[key][1]['/DA'].split(' Tf')[0].split()[-1])
            lines=[]
            for paragraph in samples[key].split('\n'):
                line=''
                for word in paragraph.split():
                    candidate=(line+' '+word).strip()
                    if line and stringWidth(candidate,'Helvetica',font_size) > f['w']*MM-5:
                        lines.append(line)
                        line=word
                    else:
                        line=candidate
                lines.append(line)
            samples[key]='\n'.join(lines)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    writer.update_page_form_field_values(None, samples, auto_regenerate=False)
    filled_path = WORK/f'{name}-filled-check.pdf'
    with filled_path.open('wb') as stream:
        writer.write(stream)
    filled = PdfReader(filled_path)
    new_fields = filled.get_fields()
    new_widgets = widgets(filled)
    for key, expected_value in samples.items():
        assert str(new_fields[key]['/V']) == expected_value
        widget = new_widgets[key][1]
        assert str(widget['/V']) == expected_value
        if widget['/FT'] == '/Tx':
            assert widget['/AP']['/N'].get_object().get_data()
        else:
            assert widget['/AS'] == '/Yes'
            assert '/Yes' in widget['/AP']['/N']
    return dict(design=name, pages=7, fields=len(fields), blank_values=True,
                widgets_match_field_tree=True, no_widget_overlaps=True,
                saved_value_roundtrip=len(samples), all_general_skills=True,
                spell_cards=4, license_embedded=True)


def render(manifests):
    # Prefer host font discovery when present; the bundled Poppler remains the fallback.
    poppler = '/usr/bin/pdftoppm' if Path('/usr/bin/pdftoppm').exists() else 'pdftoppm'
    def render_design(m):
        name = m['theme']['id']
        subprocess.run([poppler, '-scale-to', '1600', '-png',
                        str(ROOT/m['output']), str(WORK/name)], check=True, capture_output=True)
        # A filled proof on each distinct talent layout and the ruled spell page.
        for page in (1, 3, 6):
            subprocess.run([poppler, '-f', str(page), '-l', str(page),
                            '-scale-to', '1600', '-png', str(WORK/f'{name}-filled-check.pdf'),
                            str(WORK/f'{name}-filled')], check=True, capture_output=True)
        sheet = Image.new('RGB', (1600, 1190), '#dce0e1')
        draw = ImageDraw.Draw(sheet)
        for i in range(7):
            im = Image.open(WORK/f'{name}-{i+1}.png')
            im.thumbnail((382, 547))
            x = 10+(i%4)*400
            y = 30+(i//4)*590
            sheet.paste(im, (x,y))
            draw.text((x,y-18),f'{m["theme"]["name"]} / {i+1}',fill='#233039')
        sheet.save(REVIEW/f'{name}-contact.png')
    with ThreadPoolExecutor(max_workers=4) as pool:
        list(pool.map(render_design, manifests))
    # Comparison is a deliverable preview, not an edited source illustration.
    cover = Image.new('RGB', (1920, 740), '#e7e9e8')
    draw = ImageDraw.Draw(cover)
    for i,m in enumerate(manifests):
        im = Image.open(WORK/f'{m["theme"]["id"]}-1.png')
        im.thumbnail((460, 670))
        x=10+i*480
        cover.paste(im,(x,45))
        draw.text((x+4,18),m['theme']['name'].upper(),fill=m['theme']['color'])
    cover.save(REVIEW/'four-designs.png')


if __name__ == '__main__':
    WORK.mkdir(parents=True, exist_ok=True)
    manifests = json.loads((REVIEW/'manifest.json').read_text())
    results = [check(m) for m in manifests]
    render(manifests)
    (REVIEW/'checks.json').write_text(json.dumps(results,indent=2)+'\n')
    print(json.dumps(results,indent=2))
