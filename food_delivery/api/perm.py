from rest_framework import permissions

from api.models import Employee


class RestaurantOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, restaurant):
        return super().has_permission(request, view) and request.user == restaurant.owner


class RestaurantEmployee(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, restaurant):
        return (super().has_permission(request, view)
                and Employee.objects.filter(user=request.user, res=restaurant)
                .exists())
