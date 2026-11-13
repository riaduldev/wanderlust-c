import { InfoPage, InfoSection } from "@/components/info-page";

export default function TermsPage() {
  return (
    <InfoPage
      title="Terms of Service"
      intro="The rules that apply when you use Wanderlast."
    >
      <InfoSection heading="Using this site">
        <p>
          You can browse the catalogue, create bookings and manage packages
          for your own use. Please do not use the site to send automated
          requests or to resell travel packages.
        </p>
      </InfoSection>

      <InfoSection heading="Prices and availability">
        <p>
          Prices are shown per person in US dollars and come from the travel
          API. They can change at any time, so the price shown at the moment
          you book is the price that applies.
        </p>
      </InfoSection>

      <InfoSection heading="Bookings">
        <p>
          A booking confirms that you intend to travel. You can cancel it from
          My Bookings; the booking is then removed and the package becomes
          available to everyone else.
        </p>
      </InfoSection>

      <InfoSection heading="Changes to these terms">
        <p>
          We may update these terms as the product changes. The version on this
          page is the one that applies.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
