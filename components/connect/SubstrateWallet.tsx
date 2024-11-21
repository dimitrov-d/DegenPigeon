import { useState } from 'react';
import { usePolkadotExtensionWithContext } from '@/context/polkadotExtensionContext';

export const accountValueTemplate = (option: any, props: any) => {
  if (option) {
    return (
      <div>
        <div>{option?.meta?.name}</div>
      </div>
    );
  }

  return <span>{props.placeholder}</span>;
};

export const accountOptionTemplate = (option: any) => {
  return (
    <div>
      <div>{option?.meta?.name}</div>
    </div>
  );
};

export default function SubstrateWalletSelect() {
  const { accounts, actingAccount, setActingAccountIdx } =
    usePolkadotExtensionWithContext();

  return (
    <button
      options={accounts ?? undefined}
      optionLabel='address'
      placeholder='Select Account'
      value={actingAccount}
      itemTemplate={accountOptionTemplate}
      valueTemplate={accountValueTemplate}
      onChange={(event) => {
        const accountIdx = accounts
          ? accounts.findIndex(
              (account) => account.address === event.target.value.address
            )
          : 0;
        setActingAccountIdx(accountIdx);
      }}
    />
  );
}
