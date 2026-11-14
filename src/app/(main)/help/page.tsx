import { InfoPage, InfoSection } from "@/components/info-page";

export default function HelpPage() {
  return (
    <InfoPage
      title="Help Center"
      intro="Answers to the questions we get asked the most."
    >
      <InfoSection heading="How do I book a trip?">
        <p>
          Open the destinations catalogue, pick a package and choose
          &ldquo;Book now&rdquo;. The booking is stored in your browser and shows
          up under My Bookings, where you can cancel it again at any time.
        </p>
      </InfoSection>

      <InfoSection heading="How do I add a new package?">
        <p>
          Open Add Destinations, fill in the form and save it. New packages are
          sent to the travel API and appear in the catalogue straight away.
        </p>
      </InfoSection>

      <InfoSection heading="Something looks broken">
        <p>
          The catalogue and the admin dashboard are served from the travel API
          on port 8000. If the page is empty, check that the API is running and
          reload the page.
        </p>
      </InfoSection>

      <InfoSection heading="Still stuck?">
        <p>
          Call us on 786 901 1622 or write to{" "}
          <a
            href="mailto:info@wandarland.com"
            className="text-brand hover:underline"
          >
            info@wandarland.com
          </a>
          .
        </p>
      </InfoSection>
    </InfoPage>
  );
}
