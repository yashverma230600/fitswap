import { Router, type IRouter } from "express";
import {
  CreateListingBody,
  GetListingParams,
  GetListingsQueryParams,
  GetListingsResponse,
  GetListingResponse,
  GetMarketplaceStatsResponse,
  GetNearbyGymsQueryParams,
  GetNearbyGymsResponse,
  PurchaseListingBody,
  PurchaseListingParams,
  PurchaseListingResponse,
  RegisterGymBody,
  RegisterGymResponse,
} from "@workspace/api-zod";

type Listing = {
  id: string;
  title: string;
  venue: string;
  category: string;
  location: string;
  distance: string;
  originalPrice: number;
  price: number;
  savings: number;
  validUntil: string;
  access: string;
  seller: string;
  rating: number;
  image: string;
  status: string;
};

type Gym = {
  id: string;
  name: string;
  category: string;
  location: string;
  address: string;
  rating: number;
  distance: string;
  lat: number;
  lng: number;
};

const listings: Listing[] = [
  {
    id: "listing-1",
    title: "6-month all access membership",
    venue: "Cult.fit Koramangala",
    category: "Gym",
    location: "Koramangala, Bengaluru",
    distance: "1.2 km",
    originalPrice: 18000,
    price: 10999,
    savings: 39,
    validUntil: "2027-01-18",
    access: "All access",
    seller: "Arjun M.",
    rating: 4.8,
    image: "gym",
    status: "available",
  },
  {
    id: "listing-2",
    title: "Unlimited yoga studio pass",
    venue: "The Yoga House",
    category: "Yoga",
    location: "Indiranagar, Bengaluru",
    distance: "2.4 km",
    originalPrice: 12000,
    price: 7499,
    savings: 38,
    validUntil: "2026-12-04",
    access: "Unlimited classes",
    seller: "Meera K.",
    rating: 4.9,
    image: "yoga",
    status: "available",
  },
  {
    id: "listing-3",
    title: "Morning swim membership",
    venue: "Dolphin Aquatics",
    category: "Swimming",
    location: "HSR Layout, Bengaluru",
    distance: "4.1 km",
    originalPrice: 9000,
    price: 4999,
    savings: 44,
    validUntil: "2026-10-21",
    access: "Weekdays before 10am",
    seller: "Rohan P.",
    rating: 4.7,
    image: "swimming",
    status: "available",
  },
  {
    id: "listing-4",
    title: "Weekend football league",
    venue: "Play Arena",
    category: "Sports",
    location: "Whitefield, Bengaluru",
    distance: "8.6 km",
    originalPrice: 8000,
    price: 5200,
    savings: 35,
    validUntil: "2026-11-30",
    access: "Saturday + Sunday",
    seller: "Nikhil R.",
    rating: 4.6,
    image: "sports",
    status: "available",
  },
];

const gyms: Gym[] = [
  {
    id: "gym-1",
    name: "Cult.fit Koramangala",
    category: "Gym",
    location: "Koramangala, Bengaluru",
    address: "80 Feet Road, 5th Block",
    rating: 4.8,
    distance: "1.2 km",
    lat: 12.9352,
    lng: 77.6245,
  },
  {
    id: "gym-2",
    name: "The Yoga House",
    category: "Yoga",
    location: "Indiranagar, Bengaluru",
    address: "12th Main Road, HAL 2nd Stage",
    rating: 4.9,
    distance: "2.4 km",
    lat: 12.9784,
    lng: 77.6408,
  },
  {
    id: "gym-3",
    name: "Dolphin Aquatics",
    category: "Swimming",
    location: "HSR Layout, Bengaluru",
    address: "27th Main, Sector 2",
    rating: 4.7,
    distance: "4.1 km",
    lat: 12.9116,
    lng: 77.6389,
  },
  {
    id: "gym-4",
    name: "Play Arena",
    category: "Sports",
    location: "Whitefield, Bengaluru",
    address: "Sarjapur-Marathahalli Road",
    rating: 4.6,
    distance: "8.6 km",
    lat: 12.9698,
    lng: 77.7499,
  },
];

const router: IRouter = Router();

router.get("/listings", (req, res): void => {
  const parsed = GetListingsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid listing filters");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, location, search, maxPrice } = parsed.data;
  const normalizedSearch = search?.toLowerCase();
  const normalizedLocation = location?.toLowerCase();
  const result = listings.filter((listing) => {
    const matchesCategory =
      !category ||
      category.toLowerCase() === "all" ||
      listing.category.toLowerCase() === category.toLowerCase();
    const matchesLocation =
      !normalizedLocation ||
      listing.location.toLowerCase().includes(normalizedLocation);
    const matchesSearch =
      !normalizedSearch ||
      `${listing.title} ${listing.venue} ${listing.category} ${listing.location}`
        .toLowerCase()
        .includes(normalizedSearch);
    const matchesPrice = maxPrice == null || listing.price <= maxPrice;
    return matchesCategory && matchesLocation && matchesSearch && matchesPrice;
  });

  res.json(GetListingsResponse.parse(result));
});

router.post("/listings", (req, res): void => {
  const parsed = CreateListingBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid listing payload");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const listing: Listing = {
    ...parsed.data,
    id: `listing-${listings.length + 1}`,
    distance: "New",
    savings: Math.max(
      0,
      Math.round((1 - parsed.data.price / parsed.data.originalPrice) * 100),
    ),
    rating: 5,
    status: "available",
  };
  listings.unshift(listing);
  res.status(201).json(GetListingResponse.parse(listing));
});

router.get("/listings/:id", (req, res): void => {
  const params = GetListingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const listing = listings.find((item) => item.id === params.data.id);
  if (!listing) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }

  res.json(GetListingResponse.parse(listing));
});

router.post("/listings/:id", (req, res): void => {
  const params = PurchaseListingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = PurchaseListingBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const listing = listings.find((item) => item.id === params.data.id);
  if (!listing) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }
  listing.status = "reserved";

  res.json(
    PurchaseListingResponse.parse({
      confirmationId: `FS-${Date.now().toString(36).toUpperCase()}`,
      listing,
      message: `Your membership is reserved, ${body.data.buyerName}.`,
    }),
  );
});

router.get("/stats", (_req, res): void => {
  res.json(
    GetMarketplaceStatsResponse.parse({
      activeListings: listings.filter((listing) => listing.status === "available")
        .length,
      averageSavings: Math.round(
        listings.reduce((sum, listing) => sum + listing.savings, 0) /
          Math.max(listings.length, 1),
      ),
      cities: 6,
      membershipsSwapped: 1284,
    }),
  );
});

router.get("/gyms/nearby", (req, res): void => {
  const parsed = GetNearbyGymsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const normalizedLocation = parsed.data.location?.toLowerCase();
  const result = gyms.filter(
    (gym) =>
      !normalizedLocation ||
      gym.location.toLowerCase().includes(normalizedLocation) ||
      gym.name.toLowerCase().includes(normalizedLocation),
  );
  res.json(GetNearbyGymsResponse.parse(result));
});

router.post("/gyms/nearby", (req, res): void => {
  const parsed = RegisterGymBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid gym payload");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const gym: Gym = {
    ...parsed.data,
    id: `gym-${gyms.length + 1}`,
    rating: 5,
    distance: "New",
  };
  gyms.unshift(gym);
  res.status(201).json(RegisterGymResponse.parse(gym));
});

export default router;