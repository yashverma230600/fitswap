package com.fitswap.api.controller;

import com.fitswap.api.model.Gym;
import com.fitswap.api.model.Listing;
import com.fitswap.api.service.MarketplaceService;
import com.fitswap.api.service.MarketplaceService.MarketplaceStats;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MarketplaceController {
  private final MarketplaceService marketplaceService;

  public MarketplaceController(MarketplaceService marketplaceService) {
    this.marketplaceService = marketplaceService;
  }

  @GetMapping("/listings")
  public List<Listing> getListings(
    @RequestParam(required = false) String category,
    @RequestParam(required = false) String location,
    @RequestParam(required = false) String search,
    @RequestParam(required = false) Integer maxPrice
  ) {
    return marketplaceService.getListings(category, location, search, maxPrice);
  }

  @GetMapping("/listings/{id}")
  public Listing getListing(@PathVariable String id) {
    return marketplaceService.getListingById(id);
  }

  @PostMapping("/listings")
  @ResponseStatus(HttpStatus.CREATED)
  public Listing createListing(@RequestBody Listing listing) {
    return marketplaceService.createListing(listing);
  }

  @GetMapping("/stats")
  public MarketplaceStats getStats() {
    return marketplaceService.getStats();
  }

  @GetMapping("/gyms")
  public List<Gym> getNearbyGyms(
    @RequestParam(required = false) String location,
    @RequestParam(required = false) Integer radius
  ) {
    return marketplaceService.getNearbyGyms(location, radius);
  }

  @PostMapping("/listings/{id}/purchase")
  public Map<String, String> purchaseListing(@PathVariable String id) {
    return Map.of("confirmationId", "FS-JAVA-" + id.toUpperCase(), "message", "Purchase completed");
  }
}
