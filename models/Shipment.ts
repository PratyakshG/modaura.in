import { model, models, Schema } from "mongoose";
import { shipmentTypes } from "../types/index";

const ShipmentSchema = new Schema<shipmentTypes>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    carrier: {
      type: String,
      required: true,
      enum: ["FedEx", "UPS", "DHL", "India Post", "Flipkart Logistics", "Delhivery"],
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "shipped", "in_transit", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    estimatedDeliveryDate: {
      type: Date,
      required: false,
    },
    actualDeliveryDate: {
      type: Date,
      required: false,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Shipment = models?.Shipment || model<shipmentTypes>("Shipment", ShipmentSchema);

export default Shipment;
