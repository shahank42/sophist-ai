import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Country, ICountry, IState, State } from "country-state-city";

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
  // Get all countries
  const countries = Country.getAllCountries();

  // Get states for selected country
  const states = billing.country
    ? State.getStatesOfCountry(billing.country)
    : [];

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
      <div className="grid grid-cols-2 gap-4">
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
      <div className="grid grid-cols-2 gap-4">
        <Select
          value={billing.country}
          onValueChange={(value) =>
            onChange({ ...billing, country: value, state: "" })
          }
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country: ICountry) => (
              <SelectItem key={country.isoCode} value={country.isoCode}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={billing.state}
          onValueChange={(value) => onChange({ ...billing, state: value })}
          disabled={!billing.country || states.length === 0}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state: IState) => (
              <SelectItem key={state.isoCode} value={state.isoCode}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
