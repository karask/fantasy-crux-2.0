import unittest

from cut_stack import collated_pages, cut_stack_order


class CutStackTests(unittest.TestCase):
    def test_current_four_page_proof(self):
        self.assertEqual(cut_stack_order(4), [([1, 3], [4, 2])])

    def test_six_pages_need_no_binding_padding(self):
        self.assertEqual(cut_stack_order(6), [([1, 5], [6, 2]), ([3, None], [None, 4])])

    def test_two_sheet_stack(self):
        self.assertEqual(cut_stack_order(8), [([1, 5], [6, 2]), ([3, 7], [8, 4])])

    def test_all_sizes_through_128_pages(self):
        for page_count in range(1, 129):
            with self.subTest(page_count=page_count):
                order = cut_stack_order(page_count)
                self.assertEqual(collated_pages(order), list(range(1, page_count + 1)))
                for front, back in order:
                    for first, second in [(front[0], back[1]), (front[1], back[0])]:
                        if first is not None:
                            self.assertEqual(first % 2, 1)
                        if second is not None:
                            self.assertEqual(second, first + 1)

    def test_invalid_counts(self):
        for value in [0, -1, 1.5, True, "4"]:
            with self.assertRaises(ValueError):
                cut_stack_order(value)


if __name__ == "__main__":
    unittest.main()
