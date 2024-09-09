from django.contrib import admin
from django.db.models import Count
from django.template.response import TemplateResponse
from django.urls import path
from django.utils.safestring import mark_safe
from django_ckeditor_5.widgets import CKEditor5Widget
from . import dao
from .models import *
from django import forms


class RoleAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']
    list_filter = ['name']


class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username']
    search_fields = ['username']
    list_filter = ['role']
    readonly_fields = ['img']

    def img(self, user):
        if user:
            return mark_safe(f"<img width='120' height='120' src='{user.avatar.url}' />")
        return 'No image'

    class Media:
        css = {
            'all': ('/static/admin/css/style.css', )
        }


class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'res']
    list_filter = ['res']
    readonly_fields = ['img']

    def img(self, employee):
        if employee:
            return mark_safe(f"<img width='120' height='120' src='{employee.avatar.url}' />")
        return 'No image'


class EmployeeInlineAdmin(admin.StackedInline):
    model = Employee
    fk_name = 'res'


class RestaurantCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']


class RestaurantAdminForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['owner'].queryset = User.objects.filter(role_id=2)

    def img(self, restaurant):
        if restaurant:
            return mark_safe(f"<img width='120' height='120' src='{restaurant.image.url}' />")
        return 'No image'

    class Meta:
        model = Restaurant
        fields = '__all__'


class FoodCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']


class FoodAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'rating', 'restaurant']
    search_fields = ['name']
    list_filter = ['restaurant', 'category']
    readonly_fields = ['img']

    def img(self, food):
        if food:
            return mark_safe(f"<img width='120' height='120' src='{food.image.url}' />")
        return 'No image'


class FoodInlineAdmin(admin.StackedInline):
    model = Food
    fk_name = 'restaurant'


class RestaurantAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'phone_number', 'address', 'rating', 'owner']
    search_fields = ['name']
    list_filter = ['category']
    readonly_fields = ['img']
    form = RestaurantAdminForm
    inlines = [FoodInlineAdmin, EmployeeInlineAdmin, ]

    def img(self, restaurant):
        if restaurant:
            return mark_safe(f"<img width='120' height='120' src='{restaurant.image.url}' />")
        return 'No image'


class NotificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'message', 'user']
    search_fields = ['message']
    list_filter = ['user']


class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'note', 'status', 'user', 'restaurant']
    list_filter = ['user', 'restaurant', 'status']


class CartDetailAdmin(admin.ModelAdmin):
    list_display = ['id', 'cart_id', 'food', 'amount', 'quantity']
    list_filter = ['cart_id']


class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'cart', 'status', 'method', 'note']
    list_filter = ['status']


class RatingAdminForm(forms.ModelForm):
    comment = forms.CharField(widget=CKEditor5Field)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["comment"].required = False

    class Meta:
        model = Rating
        fields = '__all__'
        widgets = {
            "comment": CKEditor5Widget(
                attrs={"class": "django_ckeditor_5"}
            )
        }


class RatingAdmin(admin.ModelAdmin):
    list_display = ['id', 'star', 'comment', 'payment']
    search_fields = ['comment']
    list_filter = ['star', 'payment']
    readonly_fields = ['img']
    form = RatingAdminForm

    def img(self, rating):
        if rating:
            return mark_safe(f"<img width='120' height='120' src='{rating.image.url}' />")
        return 'No image'


class FoodDeliveryAdminSite(admin.AdminSite):
    site_header = 'HỆ THỐNG WEBSITE GIAO ĐỒ ĂN'

    def get_urls(self):
        return [
            path('stats/', self.stats_view),
        ] + super().get_urls()

    def stats_view(self, request):
        total_restaurant = dao.count_restaurant()
        total_user = dao.count_user()
        stats = Restaurant.objects \
            .annotate(food_count=Count('food')) \
            .values('id', 'name', 'food_count')
        return TemplateResponse(request, 'admin/stats.html', {
            'total_user': total_user,
            'total_restaurant': total_restaurant,
            'restaurant_stats': stats
        })


admin_site = FoodDeliveryAdminSite(name='myadmin')

admin_site.register(User, UserAdmin)
admin_site.register(Employee, EmployeeAdmin)
admin_site.register(Role, RoleAdmin)
admin_site.register(RestaurantCategory, RestaurantCategoryAdmin)
admin_site.register(Restaurant, RestaurantAdmin)
admin_site.register(FoodCategory, FoodCategoryAdmin)
admin_site.register(Food, FoodAdmin)
admin_site.register(Cart, CartAdmin)
admin_site.register(CartDetail, CartDetailAdmin)
admin_site.register(Payment, PaymentAdmin)
admin_site.register(Rating, RatingAdmin)
admin_site.register(Notification, NotificationAdmin)
