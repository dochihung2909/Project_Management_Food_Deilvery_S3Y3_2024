from django.urls import path, include
from . import views
from rest_framework import routers

from .views import *

router = routers.DefaultRouter()
router.register('users', UserViewSet)
router.register('restaurant-categories', RestaurantCategoryViewSet)
router.register('food-categories', FoodCategoryViewSet)
router.register('restaurants', RestaurantViewSet)
router.register('employees', EmployeeViewSet)
router.register('foods', FoodViewSet)
router.register('notifications', NotificationViewSet)
router.register('carts', CartViewSet)
router.register('cart-details', CartDetailViewSet)
router.register('payments', PaymentViewSet)
router.register('ratings', RatingViewSet)

urlpatterns = [
    path('', include(router.urls)),

    path('stats/users/', StatsViewSet.as_view({'get': 'count_users'})),
    path('stats/users/quarter=<int:quarter>', StatsViewSet.as_view({'get': 'count_users_by_quarter'})),

    path('stats/payments/', StatsViewSet.as_view({'get': 'count_payments'})),

    path('stats/restaurants/', StatsViewSet.as_view({'get': 'count_restaurants'})),

    path('search=<str:food_name>', FoodSearchView.as_view()),
    path('search-restaurant=<str:restaurant_name>', RestaurantSearchView.as_view()),

    path('token/', TokenViewSet.as_view({'post': 'create'}))
]