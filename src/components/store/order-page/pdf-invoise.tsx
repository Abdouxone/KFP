import { formatPrice } from "@/components/shared/format-price";
import { OrderFullType } from "@/lib/types";
import {
  Document,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

export const generateOrderPDFBlob = async (
  order: OrderFullType
): Promise<Blob> => {
  if (!order) throw new Error("Order is required to generate the PDF.");

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 11,
      fontFamily: "Helvetica",
      color: "#333",
    },
    header: {
      fontSize: 24,
      marginBottom: 8,
      textAlign: "center",
      fontWeight: "bold",
      color: "#1a1a1a",
    },
    subheader: {
      fontSize: 10,
      marginBottom: 20,
      textAlign: "center",
      color: "#666",
    },
    section: {
      marginBottom: 20,
      padding: 15,
      backgroundColor: "#f9fafb",
      borderRadius: 4,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "bold",
      marginBottom: 8,
      color: "#1a1a1a",
      borderBottom: "2 solid #e5e7eb",
      paddingBottom: 4,
    },
    infoRow: {
      flexDirection: "row",
      marginBottom: 4,
    },
    infoLabel: {
      width: "35%",
      fontWeight: "bold",
      color: "#4b5563",
    },
    infoValue: {
      width: "65%",
      color: "#1f2937",
    },
    groupContainer: {
      marginBottom: 20,
      border: "1 solid #e5e7eb",
      borderRadius: 4,
      overflow: "hidden",
    },
    groupHeader: {
      backgroundColor: "#f3f4f6",
      padding: 10,
      borderBottom: "1 solid #e5e7eb",
    },
    groupTitle: {
      fontSize: 13,
      fontWeight: "bold",
      marginBottom: 6,
      color: "#1a1a1a",
    },
    groupInfo: {
      fontSize: 10,
      color: "#4b5563",
      marginBottom: 2,
    },
    table: {
      width: "100%",
      marginTop: 10,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#e5e7eb",
      padding: 8,
      fontWeight: "bold",
      fontSize: 10,
      color: "#374151",
    },
    tableRow: {
      flexDirection: "row",
      borderBottom: "1 solid #f3f4f6",
      padding: 8,
      fontSize: 10,
    },
    tableRowAlt: {
      backgroundColor: "#fafafa",
    },
    colItem: {
      width: "45%",
      paddingRight: 5,
    },
    colQty: {
      width: "15%",
      textAlign: "center",
    },
    colPrice: {
      width: "20%",
      textAlign: "right",
    },
    colTotal: {
      width: "20%",
      textAlign: "right",
      fontWeight: "bold",
    },
    totalsSection: {
      marginTop: 20,
      padding: 15,
      backgroundColor: "#f3f4f6",
      borderRadius: 4,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    grandTotal: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
      paddingTop: 8,
      borderTop: "2 solid #9ca3af",
      fontSize: 14,
      fontWeight: "bold",
    },
    footer: {
      position: "absolute",
      bottom: 30,
      left: 40,
      right: 40,
      textAlign: "center",
      fontSize: 9,
      color: "#9ca3af",
      borderTop: "1 solid #e5e7eb",
      paddingTop: 10,
    },
    badge: {
      padding: "4 8",
      borderRadius: 3,
      fontSize: 9,
      fontWeight: "bold",
    },
    badgeSuccess: {
      backgroundColor: "#dcfce7",
      color: "#166534",
    },
    badgeWarning: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
    },
  });

  const OrderInvoicePdf = () => (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>Order Invoice</Text>
        <Text style={styles.subheader}>
          Generated on {new Date().toLocaleDateString()}
        </Text>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order ID:</Text>
            <Text style={styles.infoValue}>{order.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order Date:</Text>
            <Text style={styles.infoValue}>
              {new Date(order.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order Status:</Text>
            <Text style={styles.infoValue}>{order.orderStatus}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Status:</Text>
            <Text style={styles.infoValue}>{order.payementStatus}</Text>
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <Text style={{ marginBottom: 2 }}>
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          </Text>
          <Text style={{ marginBottom: 2 }}>{order.shippingAddress.phone}</Text>
          <Text style={{ marginBottom: 2 }}>
            {order.shippingAddress.address1}
          </Text>
          <Text>{order.shippingAddress.willaya.name}</Text>
        </View>

        {/* Order Groups */}
        {order.groups.map((group, groupIndex) => (
          <View key={group.id} style={styles.groupContainer}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupTitle}>
                Group {groupIndex + 1} - {group.store.name}
              </Text>
              <Text style={styles.groupInfo}>
                {group._count.items} item(s) • Total: {formatPrice(group.total)}
              </Text>
            </View>

            {/* Items Table */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.colItem}>Item</Text>
                <Text style={styles.colQty}>Qty</Text>
                <Text style={styles.colPrice}>Price</Text>
                <Text style={styles.colTotal}>Total</Text>
              </View>
              {group.items.map((item, idx) => (
                <View
                  style={
                    idx % 2 === 1
                      ? [styles.tableRow, styles.tableRowAlt]
                      : styles.tableRow
                  }
                  key={item.id}
                >
                  <Text style={styles.colItem}>{item.name}</Text>
                  <Text style={styles.colQty}>{item.quantity}</Text>
                  <Text style={styles.colPrice}>{formatPrice(item.price)}</Text>
                  <Text style={styles.colTotal}>
                    {formatPrice(item.totalPrice)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Order Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.grandTotal}>
            <Text>Order Total</Text>
            <Text>{formatPrice(order.total)}</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for your order! • Questions? Contact support
        </Text>
      </Page>
    </Document>
  );

  const pdfBlob = await pdf(<OrderInvoicePdf />).toBlob();
  return pdfBlob;
};
