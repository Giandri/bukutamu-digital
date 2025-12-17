// WhatsApp number mapping will be fetched from database
export const getWhatsAppNumber = async (recipientName: string): Promise<string> => {
  try {
    const response = await fetch('/api/recipients');
    const data = await response.json();

    if (data.recipients) {
      const recipient = data.recipients.find((r: any) => r.name === recipientName);
      return recipient?.whatsapp || '';
    }
  } catch (error) {
    console.error('Error fetching recipient WhatsApp:', error);
  }
  return '';
};

export const formatWhatsAppMessage = (guest: any): string => {
  return `*NOTIFIKASI TAMU BARU*\n\n👤 *Nama:* ${guest.name}\n📱 *WhatsApp:* ${guest.whatsapp}\n🎯 *Keperluan:* ${guest.purpose}\n⏰ *Waktu Kedatangan:* ${new Date().toLocaleString('id-ID')}\n\nMohon segera melayani tamu yang sudah check-in.`;
};
