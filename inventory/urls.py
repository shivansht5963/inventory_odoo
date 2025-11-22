from rest_framework.routers import DefaultRouter
from .views import StockViewSet, StockTransactionViewSet

router = DefaultRouter()
router.register("stock", StockViewSet)
router.register("transactions", StockTransactionViewSet)

urlpatterns = router.urls
