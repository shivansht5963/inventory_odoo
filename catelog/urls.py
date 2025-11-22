from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, SKUViewSet

router = DefaultRouter()
router.register("products", ProductViewSet)
router.register("skus", SKUViewSet)

urlpatterns = router.urls
