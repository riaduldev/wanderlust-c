import { InfoPage, InfoSection } from "@/components/info-page";

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy Policy"
      intro="What we store about you, and what we do not."
    >
      <InfoSection heading="What we store">
        <p>
          Your bookings are kept in the storage of your own browser. Nothing
          about them is sent to a server, and clearing your browser storage
          removes them.
        </p>
      </InfoSection>

      <InfoSection heading="What we do not store">
        <p>
          There is no account system, so we do not store your name, your email
          address or any payment details.
        </p>
      </InfoSection>

      <InfoSection heading="Third parties">
        <p>
          Package data and images are loaded from the travel API and from the
          image hosts you enter when you add a package. Those hosts see the
          request we make for their image.
        </p>
      </InfoSection>

      <InfoSection heading="Questions">
        <p>
          Write to{" "}
          <a
            href="mailto:info@wandarland.com"
            className="text-brand hover:underline"
          >
            info@wandarland.com
          </a>{" "}
          and we will answer.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
