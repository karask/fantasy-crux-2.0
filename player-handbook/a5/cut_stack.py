"""Two-up A4 cut-and-stack ordering for upright short-edge duplex printing."""

from math import ceil


def cut_stack_order(page_count):
    """Return (front, back) per sheet; None identifies an unused printed slot.

    Arrange sheets in order, fronts up. Cut the stack vertically. Place the
    complete left pile on top of the right pile, keeping both piles in order.
    Back slots reverse physically under landscape short-edge duplex printing.
    """
    if not isinstance(page_count, int) or isinstance(page_count, bool) or page_count < 1:
        raise ValueError("Page count must be a positive integer.")
    sheet_count = ceil(page_count / 4)

    def slot(page):
        return page if page <= page_count else None

    return [
        ([slot(2 * sheet + 1), slot(2 * (sheet + sheet_count) + 1)],
         [slot(2 * (sheet + sheet_count) + 2), slot(2 * sheet + 2)])
        for sheet in range(sheet_count)
    ]


def collated_pages(order):
    """Simulate cutting a duplex stack and placing left pile over right pile."""
    left = [(front[0], back[1]) for front, back in order]
    right = [(front[1], back[0]) for front, back in order]
    return [page for leaf in left + right for page in leaf if page is not None]
