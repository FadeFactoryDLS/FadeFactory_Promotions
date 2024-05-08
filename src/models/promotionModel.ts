interface promotionModel {
  promotionId: Number;
  promotionSubject: String;
  promotionDescription: String;
  promotionReceivers: Array<{ email: String; name: String }>;
}

export default promotionModel;
