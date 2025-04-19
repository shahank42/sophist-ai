import { Input } from "@/components/ui/input";

export type BillingAddress = {
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
};

interface BillingAddressFormProps {
  billing: BillingAddress;
  onChange: (billing: BillingAddress) => void;
}

export function BillingAddressForm({
  billing,
  onChange,
}: BillingAddressFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-4">
        <Input
          id="street"
          value={billing.street}
          onChange={(e) => onChange({ ...billing, street: e.target.value })}
          placeholder="Street Address"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          id="city"
          value={billing.city}
          onChange={(e) => onChange({ ...billing, city: e.target.value })}
          placeholder="City"
        />
        <Input
          id="zipcode"
          value={billing.zipcode}
          onChange={(e) => onChange({ ...billing, zipcode: e.target.value })}
          placeholder="Postal Code"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          id="state"
          value={billing.state}
          onChange={(e) => onChange({ ...billing, state: e.target.value })}
          placeholder="State"
        />
        <Input
          id="country"
          value={billing.country}
          onChange={(e) => onChange({ ...billing, country: e.target.value })}
          placeholder="Country"
        />
      </div>
    </div>
  );
}
