from django.urls import path
from .views import AlertListCreateView
from .views import AlertFilteredView

urlpatterns = [
    path('', AlertListCreateView.as_view(), name='alert-list-create'),
    path('filter/', AlertFilteredView.as_view(), name='alert-filter'),
]