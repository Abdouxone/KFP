import AddressContainer from "@/components/store/profile/addresses/container";
import {
  getUserShippingAddresses,
  getWillayaWithCommunes,
} from "@/queries/user";

export default async function ProfilePaymentPage() {
  const addresses = await getUserShippingAddresses();
  const willayas = await getWillayaWithCommunes();
  return (
    <div>
      <AddressContainer addresses={addresses} willayas={willayas} />
    </div>
  );
}
