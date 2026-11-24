package com.fitswap.api.service;

import com.fitswap.api.model.Gym;
import com.fitswap.api.model.Listing;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class InMemoryMarketplaceService implements MarketplaceService {
  private final List<Listing> listings = new ArrayList<>(List.of(
    new Listing("listing-1", "6-month all access membership", "Cult.fit Koramangala", "Gym", "Koramangala, Bengaluru", "1.2 km", 18000, 10999, 39, "2027-01-18", "All access", "Arjun M.", 4.8, "gym", "available"),
    new Listing("listing-2", "Unlimited yoga studio pass", "The Yoga House", "Yoga", "Indiranagar, Bengaluru", "2.4 km", 12000, 7499, 38, "2026-12-04", "Unlimited classes", "Meera K.", 4.9, "yoga", "available"),
    new Listing("listing-3", "Morning swim membership", "Dolphin Aquatics", "Swimming", "HSR Layout, Bengaluru", "4.1 km", 9000, 4999, 44, "2026-10-21", "Weekdays before 10am", "Rohan P.", 4.7, "swimming", "available"),
    new Listing("listing-4", "Weekend football league", "Play Arena", "Sports", "Whitefield, Bengaluru", "8.6 km", 8000, 5200, 35, "2026-11-30", "Saturday + Sunday", "Nikhil R.", 4.6, "sports", "available")
  ));

  private final List<Gym> gyms = List.of(
    new Gym("gym-1", "Cult.fit Koramangala", "Gym", "Koramangala, Bengaluru", "80 Feet Road, 5th Block", 4.8, "1.2 km", 12.9352, 77.6245),
    new Gym("gym-2", "The Yoga House", "Yoga", "Indiranagar, Bengaluru", "12th Main Road, HAL 2nd Stage", 4.9, "2.4 km", 12.9784, 77.6408),
    new Gym("gym-3", "Dolphin Aquatics", "Swimming", "HSR Layout, Bengaluru", "27th Main, Sector 2", 4.7, "4.1 km", 12.9116, 77.6389),
    new Gym("gym-4", "Play Arena", "Sports", "Whitefield, Bengaluru", "Sarjapur-Marathahalli Road", 4.6, "8.6 km", 12.9698, 77.7499)
  );

  @Override
  public List<Listing> getListings(String category, String location, String search, Integer maxPrice) {
    String normalizedCategory = category == null ? null : category.toLowerCase(Locale.ROOT);
    String normalizedLocation = location == null ? null : location.toLowerCase(Locale.ROOT);
    String normalizedSearch = search == null ? null : search.toLowerCase(Locale.ROOT);

    return listings.stream()
      .filter(listing -> normalizedCategory == null || "all".equals(normalizedCategory) || listing.category().toLowerCase(Locale.ROOT).equals(normalizedCategory))
      .filter(listing -> normalizedLocation == null || listing.location().toLowerCase(Locale.ROOT).contains(normalizedLocation))
      .filter(listing -> normalizedSearch == null || (listing.title() + " " + listing.venue() + " " + listing.category() + " " + listing.location()).toLowerCase(Locale.ROOT).contains(normalizedSearch))
      .filter(listing -> maxPrice == null || listing.price() <= maxPrice)
      .toList();
  }

  @Override
  public Listing getListingById(String id) {
    return listings.stream()
      .filter(listing -> listing.id().equals(id))
      .findFirst()
      .orElseThrow(() -> new IllegalArgumentException("Listing not found"));
  }

  @Override
  public Listing createListing(Listing listing) {
    listings.add(0, listing);
    return listing;
  }

  @Override
  public List<Gym> getNearbyGyms(String location, Integer radius) {
    return gyms;
  }

  @Override
  public MarketplaceStats getStats() {
    int activeListings = (int) listings.stream().filter(listing -> "available".equals(listing.status())).count();
    int averageSavings = (int) Math.round(listings.stream().mapToInt(listing -> listing.savings()).average().orElse(0));
    return new MarketplaceStats(activeListings, averageSavings, 6, 1284);
  }
}
