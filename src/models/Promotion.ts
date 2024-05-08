interface Promotion {
  promotionId: Number;
  promotionSubject: String;
  promotionDescription: String;
  promotionReceivers: Array<{ email: String; name: String }>;
}

export function isPromotion(arg: any): arg is Promotion {
  if (typeof arg.promotionId !== "number") throw "promotionId is not a number";

  if (typeof arg.promotionSubject !== "string")
    throw "promotionSubject is not a string";

  if (typeof arg.promotionDescription !== "string")
    throw "promotionDescription is not a string";

  if (!Array.isArray(arg.promotionReceivers))
    throw "promotionReceivers is not an array";

  for (let i in arg.promotionReceivers) {
    if (typeof arg.promotionReceivers[i].email !== "string")
      throw `email at ${i} is not a string`;

    if (typeof arg.promotionReceivers[i].name !== "string")
      throw `name at ${i}  is not a string`;
  }

  return true;
}

export default Promotion;
