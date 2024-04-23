interface promotionModel {
  promotionId: Number;
  accountName: String;
  promotionSubject: String;
  promotionDescription: String;
  promotionReceivers: Array<String>;
}

export default promotionModel;
