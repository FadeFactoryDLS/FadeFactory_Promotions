interface Promotion {
  promotionId: Number;
  promotionSubject: String;
  promotionDescription: String;
  promotionReceivers: Array<{ email: String; name: String }>;
}

export default Promotion;
