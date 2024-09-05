import re
from datetime import datetime, timedelta

from django.utils import timezone
from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import *
from .serializers import *
from .paginators import *


class UserViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = UserPaginator
    # permission_classes = [permissions.IsAuthenticated]

    @action(methods=['post'], url_path='register', detail=False)
    def register(self, request):
        required_fields = ['first_name', 'last_name', 'username', 'password', 'phone_number', 'avatar']
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
        role = Role.objects.get(pk=1)

        phone_number_pattern = r'^(\\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5|8|9]|9[0-4|6-9])[0-9]{7}$'
        no_space_pattern = r'^\S+$'
        password_pattern = r'[A-Za-z0-9@#$%^&+=]{8,}'

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
        user = User.objects.get(username=username)
        if user:
            if not user.check_password(password):
                return Response(
                    {'error': 'Wrong password!'},
                    status=status.HTTP_400_BAD_REQUEST)
            if not user.is_active:
                return Response(
                    {'error': 'The account has been locked!'},
                    status=status.HTTP_400_BAD_REQUEST)
            if user.role_id == 0 or user.role_id == 1 or user.role_id == 2:
                serializer = UserSerializer(user)
            elif user.role_id == 3:
                employee = Employee.objects.get(user=user)
                serializer = EmployeeSerializer(employee)

            return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['patch'], url_path='current-user/update', detail=False)
    def update_user(self, request, pk):
        user = request.user
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        phone_number = request.data.get('phone_number')
        avatar = request.data.get('avatar')

        update_data = {}
        if first_name is not None:
            update_data['first_name'] = first_name
        if last_name is not None:
            update_data['first_name'] = last_name
        if phone_number is not None:
            update_data['first_name'] = phone_number
        if avatar is not None:
            update_data['first_name'] = avatar

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
        password_pattern = r'[A-Za-z0-9@#$%^&+=]{8,}'
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

    @action(methods=['get'], url_path='current-user/carts/(?P<id>\d+)', detail=False)
    def get_cart_by_id(self, request, id=None):
        user = request.user
        try:
            cart = Cart.objects.get(pk=id, user=user)
        except Cart.DoesNotExist:
            return Response(
                {'error': 'Cart not found!'},
                status=status.HTTP_404_NOT_FOUND)

        serializer = CartSerializer(cart)

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
        carts = user.cart_set.filter(active=True).all()
        payments = Payment.objects.filter(cart__in=carts, active=True)

        serializer = CartSerializer(payments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='current-user/notifications', detail=False)
    def get_all_payments(self, request):
        user = request.user
        notifications = user.notification_set.filter(active=True).all()
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RestaurantCategoryViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = RestaurantCategory.objects.all()
    serializer_class = RestaurantCategorySerializer
    # permission_classes = [permissions.IsAuthenticated]


class FoodCategoryViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = FoodCategory.objects.all()
    serializer_class = FoodCategorySerializer
    # permission_classes = [permissions.IsAuthenticated]


class RestaurantViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView, generics.UpdateAPIView):
    queryset = Restaurant.objects.filter(active=True)
    serializer_class = RestaurantSerializer
    # permission_classes = [permissions.IsAuthenticated]

    @action(methods=['get'], url_path='foods', detail=True)
    def get_all_foods(self, request, pk):
        foods = self.get_object().food_set.filter(active=True).all()

        serializer = FoodSerializer(foods, many=True)

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

        isFoodExists = Food.objects.fitler(name=name, restaurant=restaurant).exists()
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

    @action(methods=['patch'], url_path='food/(?P<id>\d+)', detail=True)
    def update_food(self, request, pk, id=None):
        restaurant = self.get_object()
        try:
            food = Food.objects.get(id=id, restaurant=restaurant)
        except Food.DoesNotExists:
            return Response(
                {'error': 'Food not found!'},
                status=status.HTTP_404_NOT_FOUND)

        serializer = FoodSerializer(food, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['patch'], url_path='food/(?P<id>\d+)', detail=True)
    def delete_food(self, request, pk=None, id=None):
        restaurant = self.get_object()
        try:
            food = Food.objects.get(id=id, restaurant=restaurant)
        except Food.DoesNotExist:
            return Response(
                {'error': 'Food not found!'},
                status=status.HTTP_404_NOT_FOUND)

        # Set the food item as inactive instead of deleting it
        food.active = False
        food.save()

        return Response({'status': 'Food item deactivated'}, status=status.HTTP_200_OK)


class EmployeeViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView, generics.UpdateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    # permission_classes = [permissions.IsAuthenticated]


class FoodViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Food.objects.all()
    serializer_class = FoodSerializer
    # permission_classes = [permissions.IsAuthenticated]


class FoodSearchView(generics.ListAPIView):
    queryset = Food.objects.all()
    serializer_class = FoodSerializer

    def get_queryset(self):
        queryset = Food.objects.all()
        keyword = self.request.query_params.get('kw', None)
        if keyword:
            queryset = queryset.filter(name__icontains=keyword)
        return queryset


class RestaurantSearchView(generics.ListAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer

    def get_queryset(self):
        queryset = Restaurant.objects.all()
        keyword = self.request.query_params.get('kw', None)
        if keyword:
            queryset = queryset.filter(name__icontains=keyword)
        return queryset


class NotificationViewSet(viewsets.ViewSet,
                          generics.ListAPIView,
                          generics.RetrieveAPIView,
                          generics.UpdateAPIView,
                          generics.CreateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    # permission_classes = [permissions.IsAuthenticated]


class CartViewSet(viewsets.ViewSet,
                  generics.ListAPIView,
                  generics.RetrieveAPIView,
                  generics.UpdateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    # permission_classes = [permissions.IsAuthenticated]

    @action(methods=['get'], url_path='cart-details', detail=True)
    def get_cart_details(self, request, pk):
        cart_details = self.get_object().cartdetail_set.all()

        serializer = CartDetailSerializer(cart_details)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='cart-details', detail=True)
    def add_cart_detail(self, request, pk):
        cart = self.get_object()
        required_fields = ['cart', 'food', 'quantity']
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response({'error': f"{', '.join(missing_fields)} required"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            food = request.data.get('food')
        except Food.DoesNotExist:
            return Response(
                {'error': 'Food not found!'},
                status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get('quantity')
        try:
            quantity = int(quantity)
        except (ValueError, TypeError):
            return Response(
                {'error': 'Quantity must be a valid number'},
                status=status.HTTP_400_BAD_REQUEST)

        cart_details = CartDetail.objects.create(
            cart=cart,
            food=food,
            quantity=quantity,
        )

        serializer = CartDetailSerializer(cart_details)

        return Response(serializer.data, status=status.HTTP_200_OK)

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

    # @action(methods=['patch'], url_path='cart-details/(?P<id>\d+)', detail=True)
    # def update_cart_detail(self, request, pk):
    #     cart = self.get_object()
    #
    #     food = request.data.get('food')
    #     quantity = request.data.get('quantity')
    #
    #     update_data = {}
    #
    #     if food is not None:
    #         update_data['food'] = food
    #     if quantity is not None:
    #         update_data['quantity'] = quantity
    #
    #     serializer = CartDetailSerializer(cart, data=update_data, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     else:
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['patch'], url_path='cart-details/(?P<id>\d+)', detail=True)
    def delete_cart_detail(self, request, pk=None, id=None):
        cart = self.get_object()
        try:
            cart_details = CartDetail.objects.get(id=id, cart=cart)
        except CartDetail.DoesNotExist:
            return Response(
                {'error': 'Cart detail not found!'},
                status=status.HTTP_404_NOT_FOUND)

        cart.active = False
        cart.save()

        return Response({'status': 'Cart detail item deactivated'}, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='payments', detail=True)
    def add_payment(self, request):
        cart = self.get_object()
        required_fields = ['cart', 'status', 'note']
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response({'error': f"{', '.join(missing_fields)} required"},
                            status=status.HTTP_400_BAD_REQUEST)

        status_payment = request.data.get('status')
        note = request.data.get('note')
        payment = Payment.objects.create(
            cart=cart,
            status=status_payment,
            note=note,
        )

    @action(methods=['post'], url_path='ratings', detail=True)
    def add_rating(self, request):
        cart = self.get_object()
        required_fields = ['star', 'comment', 'iamge', 'cart']
        missing_fields = [field for field in required_fields if not request.data.get(field)]
        if missing_fields:
            return Response({'error': f"{', '.join(missing_fields)} required"},
                            status=status.HTTP_400_BAD_REQUEST)

        star = request.data.get('star')
        comment = request.data.get('comment')
        image = request.data.get('image')

        rating = Rating.objects.create(
            star=star,
            comment=comment,
            image=image,
            cart=cart,
        )

        serializer = RatingSerializer(rating)

        return Response(serializer.data, status=status.HTTP_200_OK)


class CartDetailViewSet(viewsets.ViewSet,
                        generics.ListAPIView,
                        generics.RetrieveAPIView,
                        generics.UpdateAPIView):
    queryset = CartDetail.objects.filter(active=True)
    serializer_class = CartDetailSerializer


class PaymentViewSet(viewsets.ViewSet,
                     generics.ListAPIView,
                     generics.RetrieveAPIView,
                     generics.UpdateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    # permission_classes = [permissions.IsAuthenticated]


class RatingViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView, generics.UpdateAPIView):
    queryset = Rating.objects.all()
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

