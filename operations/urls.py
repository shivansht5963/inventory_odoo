from django.urls import path
from .views import OrderCreateView, OrderFulfillView, OrderPickView, OrderShipView

urlpatterns = [
    path("orders/", OrderCreateView.as_view(), name="order-create"),
    path("orders/<uuid:pk>/fulfill/", OrderFulfillView.as_view(), name="order-fulfill"),
    path("orders/<uuid:pk>/pick/", OrderPickView.as_view(), name="order-pick"),
    path("orders/<uuid:pk>/ship/", OrderShipView.as_view(), name="order-ship"),
]
