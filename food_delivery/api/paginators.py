from rest_framework.pagination import PageNumberPagination


class UserPaginator(PageNumberPagination):
    page_size = 5
