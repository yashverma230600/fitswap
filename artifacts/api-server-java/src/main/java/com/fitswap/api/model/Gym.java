package com.fitswap.api.model;

public record Gym(
  String id,
  String name,
  String category,
  String location,
  String address,
  double rating,
  String distance,
  double lat,
  double lng
) {}
