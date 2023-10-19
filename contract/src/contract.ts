import {
  NearBindgen,
  NearPromise,
  call,
  near,
} from "near-sdk-js";
import { AccountId } from "near-sdk-js/lib/types";

interface Metadata {
  title: string | null;
  description: string | null;
  media: any | null;
  media_hash: string | null;
  copies: number | null;
  expires_at: number | null;
  starts_at: number | null;
  extra: any | null;
  reference: string | null;
  reference_hash: string | null;
}

@NearBindgen({ requireInit: false })
class MinstaProxyMinter {
  constructor() {}

  @call({ payableFunction: true })
  mint({
    owner_id,
    metadata,
    nft_contract_id,
  }: {
    owner_id: AccountId,
    metadata: string;
    nft_contract_id: AccountId;
  }) {
    try {
      const parsed_metadata: Metadata = JSON.parse(metadata);

      const promise = NearPromise.new(nft_contract_id)
        .functionCall(
          "nft_batch_mint",
          JSON.stringify({
            owner_id,
            metadata: parsed_metadata,
            num_to_mint: 1,
          }),
          near.attachedDeposit(),
          BigInt("100000000000000")
        );

      return promise.asReturn();
    } catch (error) {
      return false;
    }
  }
}
