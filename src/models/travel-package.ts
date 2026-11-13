import mongoose, { Schema, type InferSchemaType } from "mongoose";

import { TRAVEL_PACKAGE_CATEGORIES } from "@/lib/travel-package";

const travelPackageSchema = new Schema(
  {
    destinationName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    category: {
      type: String,
      required: true,
      enum: TRAVEL_PACKAGE_CATEGORIES,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    departureDate: {
      type: Date,
      required: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
    collection: "travel-packages",
  },
);

export type TravelPackageDocument = InferSchemaType<typeof travelPackageSchema>;

export const TravelPackageModel =
  mongoose.models.TravelPackage ??
  mongoose.model("TravelPackage", travelPackageSchema);
