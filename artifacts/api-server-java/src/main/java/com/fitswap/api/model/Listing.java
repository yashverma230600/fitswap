package com.fitswap.api.model;

public record Listing(
  String id,
  String title,
  String venue,
  String category,
  String location,
  String distance,
  int originalPrice,
  int price,
  int savings,
  String validUntil,
  String access,
  String seller,
  double rating,
  String image,
  String status
) {}
