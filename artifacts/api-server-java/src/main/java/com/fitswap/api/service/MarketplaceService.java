package com.fitswap.api.service;

import com.fitswap.api.model.Gym;
import com.fitswap.api.model.Listing;
import java.util.List;

public interface MarketplaceService {
  List<Listing> getListings(String category, String location, String search, Integer maxPrice);

  Listing getListingById(String id);

  Listing createListing(Listing listing);

  List<Gym> getNearbyGyms(String location, Integer radius);

  MarketplaceStats getStats();

  record MarketplaceStats(int activeListings, int averageSavings, int cities, int membershipsSwapped) {}
}
