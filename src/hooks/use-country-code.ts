import { useQuery, UseQueryResult } from "@tanstack/react-query";

// --- 1. Define the expected structure of the API response ---
// Adjust this interface based on the actual full response structure if known.
// We only *strictly* need the path to 'code' for this hook.
interface GeoApiResponse {
  geo: {
    country: {
      code: string;
      // You might have other properties here, e.g., name: string;
    };
    // You might have other geo properties here, e.g., city: string;
  };
  // You might have other top-level properties here.
}

// --- 2. Define the type for the hook's return value ---
// It's often helpful to return more than just the data,
// like loading and error states.
interface UseCountryCodeResult {
  /** The country code string, or undefined if loading, error, or not available */
  countryCode: string | undefined;
  /** Is the query currently fetching? */
  isLoading: boolean;
  /** Did the query encounter an error? */
  isError: boolean;
  /** The error object if isError is true */
  error: Error | null;
  /** The full query result object from useQuery, if more details are needed */
  queryResult: UseQueryResult<string, Error>; // Selected data type is string
}

// --- 3. Create the fetching function ---
export const fetchGeoData = async (): Promise<GeoApiResponse> => {
  const response = await fetch("http://localhost:8888/geo"); // Assumes GET request is appropriate

  if (!response.ok) {
    // Throw an error if the network response is not successful
    // React Query will catch this and put the query in an 'error' state
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  // Parse the JSON response
  const data: GeoApiResponse = await response.json();
  return data;
};

// --- 4. Create the custom hook ---
export const useCountryCode = (): UseCountryCodeResult => {
  const queryResult = useQuery<
    GeoApiResponse, // Type of data fetched by queryFn
    Error, // Type of error thrown by queryFn
    string // Type of data returned by the hook after 'select'
  >({
    // queryKey: A unique key for this query. React Query uses this for caching.
    queryKey: ["geoCountryCode"],

    // queryFn: The async function that fetches the data.
    queryFn: fetchGeoData,

    // select: A function to transform or select a part of the data.
    // This is efficient as it only causes re-renders if the selected value changes.
    select: (data) => data.geo.country.code,

    // Optional: Configure staleTime and cacheTime if needed
    // staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    // cacheTime: 10 * 60 * 1000, // Data stays in cache for 10 minutes after inactive
  });

  // --- 5. Return a structured object ---
  return {
    countryCode: queryResult.data, // `data` here is the *selected* string value
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error,
    queryResult: queryResult, // Expose the full result if needed elsewhere
  };
};
