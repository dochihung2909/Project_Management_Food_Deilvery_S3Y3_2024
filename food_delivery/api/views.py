import os
import re
from datetime import datetime, timedelta
from dotenv import load_dotenv

import requests
from django.db.models import Avg
from django.utils import timezone
from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from . import perms
from .models import *
from .serializers import *
from .paginators import *
import json

load_dotenv()


class UserViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    pagination_class = UserPaginator

    # permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['register', 'login']:
            return [permissions.AllowAny()]
        return super().get_permissions()

    @action(methods=['post'], url_path='register', detail=False)
    def register(self, request):
        required_fields = ['first_name', 'last_name', 'username', 'password', 'phone_number']
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response({'error': f"{', '.join(missing_fields)} required"},
                            status=status.HTTP_400_BAD_REQUEST)

        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        username = request.data.get('username')
        password = request.data.get('password')
        phone_number = request.data.get('phone_number')
        avatar = '123'
        role = Role.objects.get(pk=1)

        phone_number_pattern = r'^(\\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5|8|9]|9[0-4|6-9])[0-9]{7}$'
        no_space_pattern = r'^\S+$'
        password_pattern = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$'

        isUsername = User.objects.filter(username=username).exists()
        isPhoneNumber = re.match(phone_number_pattern, phone_number)
        isFirstName = re.match(no_space_pattern, first_name)
        isLastName = re.match(no_space_pattern, last_name)
        isPassword = re.fullmatch(password_pattern, password)

        if not isFirstName and not isLastName:
            return Response(
                {'error': 'first name and last name can not contain whitespaces!'},
                status=status.HTTP_400_BAD_REQUEST)
        if isUsername:
            return Response(
                {'error': 'username already exists!'},
                status=status.HTTP_400_BAD_REQUEST)
        if len(username) < 3:
            return Response(
                {'error': 'username must contains at least 3 characters!'},
                status=status.HTTP_400_BAD_REQUEST)
        if not isPhoneNumber:
            return Response(
                {'error': 'Invalid phone number!'},
                status=status.HTTP_400_BAD_REQUEST)
        if not isPassword:
            return Response(
                {'error': 'Password must be at least 8 characters long and contain number, uppercase, '
                          'lowercase, special characters!'},
                status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            password=password,
            phone_number=phone_number,
            first_name=first_name,
            last_name=last_name,
            role=role,
            avatar=avatar,
        )
        serializer = UserSerializer(user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], url_path='login', detail=False)
    def login(self, request):
        required_fields = ['username', 'password']
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response({'error': f"{', '.join(missing_fields)} required"},
                            status=status.HTTP_400_BAD_REQUEST)

        username = request.data.get('username')
        password = request.data.get('password')
        print(username, password)
        try:
            serializer = None
            user = User.objects.get(username=username)
            print(user)
            if user:
                if not user.check_password(password):
                    return Response(
                        {'error': 'Wrong username or password!'},
                        status=status.HTTP_400_BAD_REQUEST)
                if not user.is_active:
                    return Response(
                        {'error': 'The account has been locked!'},
                        status=status.HTTP_400_BAD_REQUEST)

                if user.role_id == 0 or user.role_id == 1 or user.role_id == 2 or user.is_superuser:
                    serializer = UserSerializer(user)
                elif user.role_id == 3:
                    employee = Employee.objects.get(user_ptr=user)
                    serializer = EmployeeSerializer(employee)

                token_url = 'http://127.0.0.1:8000/o/token/'
                token_data = {
                    'grant_type': 'password',
                    'username': username,
                    'password': password,
                    'client_id': os.getenv('CLIENT_ID_OAUTH'),
                    'client_secret': os.getenv('CLIENT_SECRET_OAUTH')
                }

                token_response = requests.post(token_url, data=token_data)
                if token_response.status_code == 200:
                    return Response({
                        'user': serializer.data,
                        'access_token': token_response.json().get('access_token'),
                        'refresh_token': token_response.json().get('refresh_token'),
                    }, status=status.HTTP_200_OK)
                else:
                    return Response(token_response.json(), status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'Wrong username or password!'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        try:
            user = request.user
            if not user.is_anonymous:
                serializer = UserSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except request.NoneType:
            return Response({'error': 'Something Wrong!'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['patch'], url_path='current-user/update', detail=False)
    def update_user(self, request):
        user = request.user
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        phone_number = request.data.get('phone_number')
        avatar = request.data.get('avatar')

        update_data = {}
        if first_name:
            update_data['first_name'] = first_name
        if last_name:
            update_data['last_name'] = last_name
        if phone_number:
            update_data['phone_number'] = phone_number
        if avatar:
            update_data['avatar'] = avatar

        serializer = UserSerializer(user, data=update_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['patch'], url_path='current-user/change-password', detail=False)
    def change_password(self, request):
        user = request.user

        required_fields = ['current_password', 'new_password']
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response(
                {'error': f"{', '.join(missing_fields)} required"},
                status=status.HTTP_400_BAD_REQUEST)

        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        if not user.check_password(current_password):
            return Response(
                {'error': 'Wrong password!'},
                status=status.HTTP_400_BAD_REQUEST)
        if current_password == new_password:
            return Response(
                {'error': 'New password must different old password!'},
                status=status.HTTP_400_BAD_REQUEST)
        password_pattern = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$'
        isPassword = re.fullmatch(password_pattern, new_password)
        if not isPassword:
            return Response(
                {'error': 'Password must be at least 8 characters long and contain number, uppercase, '
                          'lowercase, special characters!'},
                status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        serializer = UserSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='current-user/carts', detail=False)
    def get_all_carts(self, request):
        user = request.user
        carts = user.cart_set.filter(active=True).all()

        serializer = CartSerializer(carts, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='current-user/carts', detail=False)
    def add_cart(self, request):
        user = request.user
        required_fields = ['note', 'status', 'user', 'restaurant']
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response({'error': f"{', '.join(missing_fields)} required"},
                            status=status.HTTP_400_BAD_REQUEST)

        note = request.data.get('note')
        try:
            restaurant = request.data.get('restaurant')
        except Restaurant.DoesNotExist:
            return Response(
                {'error': 'Restaurant does not exists!'},
                status=status.HTTP_400_BAD_REQUEST)

        cart_details = CartDetail.objects.create(
            note=note,
            status=0,
            user=user,
            restaurant=restaurant,
        )

        serializer = CartDetailSerializer(cart_details)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='current-user/payments', detail=False)
    def get_all_payments(self, request):
        user = request.user
        if not user.is_anonymous:
            carts = user.cart_set.filter(active=True).all()
            payments = Payment.objects.filter(cart__in=carts, active=True).order_by('-created_date')

            serializer = PaymentSerializer(payments, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"error": 'Need Login to continue'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], url_path='current-user/notifications', detail=False)
    def get_all_notifications(self, request):
        user = request.user
        notifications = user.notification_set.filter(active=True).all()
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='current-user/restaurant', detail=False)
    def get_restaurant(self, request):
        try:
            user = request.user
            restaurant = Restaurant.objects.get(owner=user)

            return Response(OwnerRestaurantSerializer(restaurant).data, status=status.HTTP_200_OK)
        except Restaurant.DoesNotExist:
            return Response({'error': 'user does not have restaurant'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='current-user/restaurants', detail=False)
    def add_restaurant(self, request):
        user = request.user
        required_fields = ['name', 'phone_number', 'address', 'image', 'category']
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response({'error': f"{', '.join(missing_fields)} required"},
                            status=status.HTTP_400_BAD_REQUEST)

        name = request.data.get('name')
        phone_number = request.data.get('phone_number')
        address = request.data.get('address')
        image = request.data.get('image')
        category = request.data.get('category')

        restaurant = Restaurant.objects.create(
            name=name,
            phone_number=phone_number,
            address=address,
            image=image,
            rating=0,
            category=category,
            owner=user
        )

        serializer = RestaurantSerializer(restaurant)

        return Response(serializer.data, status=status.HTTP_200_OK)


class RestaurantCategoryViewSet(viewsets.ViewSet,
                                generics.ListAPIView,
                                generics.RetrieveAPIView,
                                generics.CreateAPIView):
    queryset = RestaurantCategory.objects.filter(active=True)
    serializer_class = RestaurantCategorySerializer
    # permission_classes = [permissions.IsAuthenticated]


class FoodCategoryViewSet(viewsets.ViewSet,
                          generics.ListAPIView,
                          generics.RetrieveAPIView,
                          generics.CreateAPIView,):
    queryset = FoodCategory.objects.filter(active=True)
    serializer_class = FoodCategorySerializer
    # permission_classes = [permissions.IsAuthenticated]


class RestaurantViewSet(viewsets.ViewSet,
                        generics.ListAPIView,
                        generics.RetrieveAPIView,
                        generics.UpdateAPIView):
    queryset = Restaurant.objects.filter(active=True)
    serializer_class = RestaurantSerializer
    permission_classes = [perms.IsOwner]

    @action(methods=['get'], url_path='foods', detail=True)
    def get_all_foods(self, request, pk):
        foods = self.get_object().food_set.filter(active=True).all()

        serializer = FoodSerializer(foods, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='payments', detail=True)
    def get_all_payments(self, request, pk):
        restaurant = self.get_object()
        payments = Payment.objects.filter(cart__restaurant=restaurant).order_by('-created_date')

        serializer = PaymentSerializer(payments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='food', detail=True)
    def add_food(self, request, pk):
        required_fields = ['name', 'price', 'discount', 'description', 'image', 'category']
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response({'error': f"{', '.join(missing_fields)} required"},
                            status=status.HTTP_400_BAD_REQUEST)

        name = request.data.get('name')
        price = request.data.get('price')
        discount = request.data.get('discount')
        description = request.data.get('description')
        image = request.data.get('image')
        category_id = request.data.get('category')
        try:
            category = FoodCategory.objects.get(pk=category_id)
        except FoodCategory.DoesNotExist:
            return Response(
                {'error': 'Category does not exists!'},
                status=status.HTTP_400_BAD_REQUEST)

        restaurant = self.get_object()

        isFoodExists = Food.objects.filter(name=name, restaurant=restaurant).exists()
        if isFoodExists:
            return Response(
                {'error': 'Food already exists in this restaurant'},
                status=status.HTTP_400_BAD_REQUEST)
        try:
            price = float(price)
        except (ValueError, TypeError):
            return Response(
                {'error': 'Price must be a valid number'},
                status=status.HTTP_400_BAD_REQUEST)
        try:
            discount = float(discount)
        except (ValueError, TypeError):
            return Response(
                {'error': 'Discount must be a valid number'},
                status=status.HTTP_400_BAD_REQUEST)

        food = Food.objects.create(
            name=name,
            price=price,
            discount=discount,
            description=description,
            image=image,
            category=category,
            restaurant=restaurant,
            rating=0
        )

        serializer = FoodSerializer(food)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], url_path='ratings', detail=True)
    def get_all_ratings(self, request, pk):
        restaurant = self.get_object()
        ratings = Rating.objects.filter(payment__cart__restaurant=restaurant, active=True)
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='employees', detail=True)
    def get_all_employees(self, request, pk):
        restaurant = self.get_object()
        employees = Employee.objects.filter(res=restaurant)

        if not employees:
            return Response({'error': 'Empty employees'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = EmployeeSerializer(employees, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class FoodViewSet(viewsets.ViewSet,
                  generics.ListAPIView,
                  generics.RetrieveAPIView,
                  generics.UpdateAPIView):
    queryset = Food.objects.filter(active=True)
    serializer_class = FoodSerializer

    # permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['update']:
            return [perms.RestaurantOwner, perms.RestaurantEmployee]

        return super().get_permissions()

    def update(self, request, *args, **kwargs):
        partial = True
        instance = self.get_object()
        is_delete = request.data.get('is_delete')

        if is_delete:
            instance.active = False
            instance.save()
            return Response({'message', 'delete successful.'}, status=status.HTTP_200_OK)

        allowed_fields = ['name', 'price', 'discount', 'description', 'category', 'image']
        invalid_fields = [field for field in request.data.keys() if field not in allowed_fields]
        if invalid_fields:
            return Response({'error': f'Invalid fields: {", ".join(invalid_fields)}'})

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid(raise_exception=True):
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({'error': 'Failed to update'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], url_path='ratings', detail=True)
    def get_all_ratings(self, request, pk):
        food = self.get_object()
        ratings = Rating.objects.filter(payment__cart__cartdetail__food=food, active=True)
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FoodSearchView(generics.ListAPIView):
    queryset = Food.objects.filter(active=True)
    serializer_class = FoodSerializer

    def get_queryset(self):
        queryset = Food.objects.filter(active=True)
        keyword = self.request.query_params.get('kw', None)
        if keyword:
            queryset = queryset.filter(name__icontains=keyword)
        return queryset


class RestaurantSearchView(generics.ListAPIView):
    queryset = Restaurant.objects.filter(active=True)
    serializer_class = RestaurantSerializer

    def get_queryset(self):
        queryset = Restaurant.objects.filter(active=True)
        keyword = self.request.query_params.get('kw', None)
        if keyword:
            queryset = queryset.filter(name__icontains=keyword)
        return queryset


class EmployeeViewSet(viewsets.ViewSet,
                      generics.ListAPIView,
                      generics.RetrieveAPIView,
                      generics.UpdateAPIView,
                      generics.CreateAPIView):
    queryset = Employee.objects.filter(is_active=True)
    serializer_class = EmployeeSerializer

    def create(self, request, *args, **kwargs):
        required_fields = ['first_name', 'last_name', 'username', 'password', 'phone_number', 'avatar', 'restaurant']
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response({'error': f"{', '.join(missing_fields)} required"},
                            status=status.HTTP_400_BAD_REQUEST)

        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        username = request.data.get('username')
        password = request.data.get('password')
        phone_number = request.data.get('phone_number')
        avatar = request.data.get('avatar')
        role = Role.objects.get(pk=3)
        res_id = request.data.get('restaurant')
        try:
            res = Restaurant.objects.get(pk=res_id)
        except:
            return Response(
                {'error': 'Restaurant not found!'},
                status=status.HTTP_400_BAD_REQUEST)

        phone_number_pattern = r'^(\\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5|8|9]|9[0-4|6-9])[0-9]{7}$'
        no_space_pattern = r'^\S+$'
        password_pattern = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$'

        isUsername = User.objects.filter(username=username).exists()
        isPhoneNumber = re.match(phone_number_pattern, phone_number)
        isFirstName = re.match(no_space_pattern, first_name)
        isLastName = re.match(no_space_pattern, last_name)
        isPassword = re.fullmatch(password_pattern, password)

        if not isFirstName and not isLastName:
            return Response(
                {'error': 'first name and last name can not contain whitespaces!'},
                status=status.HTTP_400_BAD_REQUEST)
        if isUsername:
            return Response(
                {'error': 'username already exists!'},
                status=status.HTTP_400_BAD_REQUEST)
        if len(username) < 3:
            return Response(
                {'error': 'username must contains at least 3 characters!'},
                status=status.HTTP_400_BAD_REQUEST)
        if not isPhoneNumber:
            return Response(
                {'error': 'Invalid phone number!'},
                status=status.HTTP_400_BAD_REQUEST)
        if not isPassword:
            return Response(
                {'error': 'Password must be at least 8 characters long and contain number, uppercase, '
                          'lowercase, special characters!'},
                status=status.HTTP_400_BAD_REQUEST)

        employee = Employee.objects.create(
            username=username,
            password=make_password(password),
            phone_number=phone_number,
            first_name=first_name,
            last_name=last_name,
            role=role,
            avatar=avatar,
            res=res,
        )
        serializer = EmployeeSerializer(employee)

        token_url = 'http://127.0.0.1:8000/o/token/'
        token_data = {
            'grant_type': 'password',
            'username': username,
            'password': password,
            'client_id': os.getenv('CLIENT_ID_OAUTH'),
            'client_secret': os.getenv('CLIENT_SECRET_OAUTH')
        }

        token_response = requests.post(token_url, data=token_data)
        if token_response.status_code == 200:
            return Response({
                'employee': serializer.data,
                'access_token': token_response.json().get('access_token'),
                'refresh_token': token_response.json().get('refresh_token'),
            }, status=status.HTTP_200_OK)
        else:
            return Response(token_response.json(), status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        if 'is_active' in request.data and not request.data['is_active']:
            request.data['is_active'] = False
        else:
            return Response(
                {'error': 'Invalid request. Only deactivation is allowed.'},
                status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()


class TokenViewSet(viewsets.ViewSet,
                   generics.CreateAPIView):
    def create(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'refresh_token required.'}, status=status.HTTP_400_BAD_REQUEST)
        token_url = 'http://127.0.0.1:8000/o/token/'
        token_data = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
            'client_id': os.getenv('CLIENT_ID_OAUTH'),
            'client_secret': os.getenv('CLIENT_SECRET_OAUTH')
        }
        token_response = requests.post(token_url, data=token_data)
        if token_response.status_code == 200:
            return Response({
                'access_token': token_response.json().get('access_token'),
            }, status=status.HTTP_200_OK)
        else:
            return Response({'refresh_token has expired!'}, status=status.HTTP_400_BAD_REQUEST)


class NotificationViewSet(viewsets.ViewSet,
                          generics.ListAPIView,
                          generics.RetrieveAPIView,
                          generics.UpdateAPIView,
                          generics.CreateAPIView):
    queryset = Notification.objects.filter(active=True)
    serializer_class = NotificationSerializer
    # permission_classes = [permissions.IsAuthenticated]


class CartViewSet(viewsets.ViewSet,
                  generics.ListAPIView,
                  generics.RetrieveAPIView,
                  generics.UpdateAPIView,
                  generics.CreateAPIView,
                  generics.DestroyAPIView):
    queryset = Cart.objects.filter(active=True)
    serializer_class = CartSerializer

    # permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        if request.method == 'POST':
            required_fields = ['user', 'restaurant']
            missing_fields = [field for field in required_fields if not request.data.get(field)]
            if missing_fields:
                return Response({'error': f"{', '.join(missing_fields)} required"},
                                status=status.HTTP_400_BAD_REQUEST)

            # data = json.loads(request.body.decode('utf-8'))

            restaurant = request.data.get('restaurant')
            user = request.data.get('user')

            try:
                cart = Cart.objects.get(user=user, restaurant=restaurant, status=0)
                print(cart)

                if cart:
                    return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)
            except Cart.DoesNotExist:
                restaurant = Restaurant.objects.get(pk=restaurant)
                user = User.objects.get(pk=user)

                created = Cart.objects.create(
                    user = user,
                    restaurant = restaurant
                )
                return Response(CartSerializer(created).data, status=status.HTTP_201_CREATED)

            return Response({'error': "Something wrong!"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], url_path='cart-details', detail=True)
    def get_cart_details(self, request, pk):
        cart_details = self.get_object().cartdetail_set.all()

        serializer = CartDetailSerializer(cart_details)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='cart-details', detail=True)
    def add_cart_detail(self, request, pk):
        cart = self.get_object()
        required_fields = ['food', 'quantity']
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response({'error': f"{', '.join(missing_fields)} required"},
                            status=status.HTTP_400_BAD_REQUEST)

        food_id = request.data.get('food')
        quantity = request.data.get('quantity')

        is_delete = request.data.get('is_delete')

        # Lấy 'Món Ăn'
        try:
            food = Food.objects.get(pk=food_id)

            if cart.restaurant != food.restaurant:
                return Response({'error': "NOT GOOD"}, status=status.HTTP_400_BAD_REQUEST)
        except Food.DoesNotExist:
            return Response({'error': 'Food not found!'}, status=status.HTTP_404_NOT_FOUND)

        # Xử lý 'Số Lượng'
        try:
            quantity = int(quantity)
            if quantity <= 0:
                return Response({'error': 'Quantity must be greater than zero!'},
                                status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'Quantity must be a valid number!'}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra 'Món Ăn' đã có trong giỏ hàng chưa
        try:
            cart_detail = CartDetail.objects.get(cart=cart, food=food)

            if cart_detail:
                print(quantity)
                if is_delete:
                    cart_quantity = cart_detail.quantity
                    if cart_quantity <= quantity:
                        cart_detail.delete()
                        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)
                    else:
                        cart_detail.quantity -= quantity
                else:
                    cart_detail.quantity += quantity
                cart_detail.amount = (food.price - food.discount) * cart_detail.quantity
                cart_detail.save()

                return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

        except CartDetail.DoesNotExist:
            amount = (food.price - food.discount) * quantity
            cart_details = CartDetail.objects.create(
                cart=cart,
                food=food,
                quantity=quantity,
                amount=amount,
            )

            serializer = CartDetailSerializer(cart_details)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['patch'], url_path='update', detail=True)
    def update_cart(self, request, pk):
        cart = self.get_object()

        note = request.data.get('note')
        status = request.data.get('status')
        user = request.data.get('user')

        update_data = {}

        if note is not None:
            update_data['note'] = note
        if status is not None:
            update_data['status'] = status
        if user is not None:
            update_data['user'] = user

        serializer = CartSerializer(cart, data=update_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='payments', detail=True)
    def add_payment(self, request, pk):
        cart = self.get_object()
        required_fields = ['status', 'method']
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response({'error': f"{', '.join(missing_fields)} required"},
                            status=status.HTTP_400_BAD_REQUEST)

        status_payment = request.data.get('status')
        method = request.data.get('method')
        note = request.data.get('note', '')

        try:
            status_payment = int(status_payment)
            list_status = [s for s, _ in PaymentStatus.choices]
            isValidStatus = status_payment in list_status
            if not isValidStatus:
                return Response({'error': 'status not found!'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'status must be a valid number!'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            method = int(method)
            list_methods = [method for method, _ in PaymentMethod.choices]
            isValidMethod = method in list_methods
            if not isValidMethod:
                return Response({'error': 'method not found!'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'method must be a valid number!'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            isCartPaid = Payment.objects.filter(cart=cart).exists()
            if isCartPaid:
                return Response({'error': 'This cart has been paid!'}, status=status.HTTP_400_BAD_REQUEST)

            payment = Payment.objects.create(
                cart=cart,
                status=status_payment,
                method=method,
                note=note,
            )

            cart.status = 1
            cart.save()

            serializer = PaymentSerializer(payment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment Does Not Exit'}, status=status.HTTP_400_BAD_REQUEST)


class CartDetailViewSet(viewsets.ViewSet,
                        generics.RetrieveAPIView,
                        generics.UpdateAPIView,
                        generics.DestroyAPIView):
    queryset = CartDetail.objects.filter(active=True)
    serializer_class = CartDetailSerializer

    def partial_update(self, request, *args, **kwargs):
        cart_detail = self.get_object()

        quantity = request.data.get('quantity')

        if quantity is not None:
            try:
                quantity = int(quantity)
                if quantity <= 0:
                    return Response({'error': 'Quantity must be greater than 0.'}, status=status.HTTP_400_BAD_REQUEST)
            except:
                return Response({'error': 'Quantity must be a valid number.'}, status=status.HTTP_400_BAD_REQUEST)

            food = cart_detail.food
            amount = (food.price * quantity) - food.discount

            cart_detail.quantity = quantity
            cart_detail.amount = amount
            cart_detail.save()

            serializer = self.get_serializer(cart_detail)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Quantity is required.'}, status=status.HTTP_400_BAD_REQUEST)


class PaymentViewSet(viewsets.ViewSet,
                     generics.ListAPIView,
                     generics.RetrieveAPIView,
                     generics.UpdateAPIView):
    queryset = Payment.objects.filter(active=True)
    serializer_class = PaymentSerializer

    # permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        payment = self.get_object()

        payment_status = request.data.get('status')
        is_delete = request.data.get('is_delete')
        if is_delete:
            return Response({'DELETE'}, status=status.HTTP_200_OK)

        if payment_status:
            payment.status = PaymentStatus(int(payment_status))
            payment.save()
            return Response(PaymentSerializer(payment).data, status=status.HTTP_200_OK)

        return Response({'Hello'}, status=status.HTTP_200_OK)


    @action(methods=['post'], url_path='ratings', detail=True)
    def add_rating(self, request, pk):
        payment = self.get_object()

        # Kiểm tra phương thức thanh toán của đơn hàng hoàn thành chưa
        if payment.status != 3:
            return Response({'error': 'This payment has not been completed!'}, status=status.HTTP_400_BAD_REQUEST)

        required_fields = ['star', 'comment', 'image']
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response({'error': f"{', '.join(missing_fields)} required"},
                            status=status.HTTP_400_BAD_REQUEST)

        star = request.data.get('star')
        comment = request.data.get('comment', '')
        image = request.data.get('image')
        try:
            star = int(star)
            if star <= 0 or star > 5:
                return Response({'error': 'star must between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'star must be a valid number!'}, status=status.HTTP_400_BAD_REQUEST)

        rating = Rating.objects.create(
            star=star,
            comment=comment,
            image=image,
            payment=payment,
        )

        # Đánh giá sao Restaurant và Food trong Cart
        cart = payment.cart
        restaurant = cart.restaurant
        restaurant_avg_rating = Rating.objects.filter(payment__cart__restaurant=restaurant).aggregate(Avg('star'))[
            'star__avg']
        restaurant.rating = restaurant_avg_rating
        restaurant.save()

        cart_details = cart.cartdetail_set.all()
        for cart_detail in cart_details:
            food = cart_detail.food
            food_avg_rating = Rating.objects.filter(payment__cart__cartdetail__food=food).aggregate(Avg('star'))[
                'star__avg']
            food.rating = food_avg_rating
            food.save()

        serializer = RatingSerializer(rating)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RatingViewSet(viewsets.ViewSet,
                    generics.ListAPIView,
                    generics.RetrieveAPIView):
    queryset = Rating.objects.filter(active=True)
    serializer_class = RatingSerializer
    # permission_classes = [permissions.IsAuthenticated]


class StatsViewSet(viewsets.ViewSet):
    # permission_classes = [permissions.IsAuthenticated]

    def count_users(self, request, *args, **kwargs):
        user_count = User.objects.count()
        return Response({"total_user": user_count}, status=status.HTTP_200_OK)

    def count_payments(self, request, *args, **kwargs):
        count_payment = Payment.objects.count()
        return Response({"total_payment": count_payment}, status=status.HTTP_200_OK)

    def count_restaurants(self, request, *args, **kwargs):
        count_restaurant = Restaurant.objects.count()
        return Response({"total_restaurant": count_restaurant}, status=status.HTTP_200_OK)
