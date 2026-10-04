import type { RuleId } from '../src/contracts.ts';

export type SyntheticFixture = {
  id: string;
  text: string;
  expected: readonly { ruleId: RuleId; text: string }[];
  provenance: 'synthetic_for_oss_clean_reconstruction';
};
const provenance = 'synthetic_for_oss_clean_reconstruction' as const;
const tai = (text: string) => ({ ruleId: 'grammar.tai' as const, text });
const you = (text: string) => ({ ruleId: 'grammar.you_ni_naru' as const, text });
const kamo = (text: string) => ({ ruleId: 'grammar.kamoshirenai' as const, text });

export const fixtures: readonly SyntheticFixture[] = [
  { id: 'F01', text: 'まるい箱。', expected: [], provenance },
  { id: 'F02', text: '白い紙を読みたい。', expected: [tai('読みたい')], provenance },
  { id: 'F03', text: '小さな星を見たい。', expected: [tai('見たい')], provenance },
  { id: 'F04', text: 'お茶をのみたい。', expected: [tai('のみたい')], provenance },
  { id: 'F05', text: '円をかきたい。', expected: [tai('かきたい')], provenance },
  { id: 'F06', text: '本をひらきたい。', expected: [tai('ひらきたい')], provenance },
  { id: 'F07', text: '花を植えたい。', expected: [tai('植えたい')], provenance },
  { id: 'F08', text: '冷たい風。', expected: [], provenance },
  { id: 'F09', text: '反対です。', expected: [], provenance },
  { id: 'F10', text: '紙を読みたかった。', expected: [], provenance },
  { id: 'F11', text: '紙を読みます。', expected: [], provenance },
  { id: 'F12', text: '紙を読みたいです。', expected: [], provenance },
  { id: 'F13', text: '🪴紙を読みたい。', expected: [tai('読みたい')], provenance },
  { id: 'F14', text: 'そらは青い。', expected: [], provenance },
  { id: 'F15', text: 'うみは青い。', expected: [], provenance },
  { id: 'F16', text: 'できるようになる。', expected: [you('できるようになる')], provenance },
  { id: 'F17', text: '🧩石は白い。', expected: [], provenance },
  { id: 'F18', text: '違う文。', expected: [], provenance },
  { id: 'F19', text: 'できるようになった。', expected: [you('できるようになった')], provenance },
  { id: 'F20', text: 'できるようになります。', expected: [], provenance },
  { id: 'F21', text: 'できるようにする。', expected: [], provenance },
  { id: 'F22', text: 'できるようになるべく。', expected: [], provenance },
  { id: 'F23', text: '字ができるようになる。', expected: [you('できるようになる')], provenance },
  { id: 'F24', text: '青くなるかもしれない。', expected: [kamo('かもしれない')], provenance },
  { id: 'F25', text: '赤いかもしれません。', expected: [kamo('かもしれません')], provenance },
  { id: 'F26', text: 'かもしれない。', expected: [], provenance },
  { id: 'F27', text: '雨かもしれなかった。', expected: [], provenance },
  { id: 'F28', text: '雨かもしれない人。', expected: [], provenance },
  { id: 'F29', text: '紙を読みたい。雨かもしれない。', expected: [tai('読みたい'), kamo('かもしれない')], provenance },
  { id: 'F30', text: 'できるようになる。紙を折りたい。', expected: [you('できるようになる'), tai('折りたい')], provenance },
  { id: 'F31', text: '🪴雨かもしれない。', expected: [kamo('かもしれない')], provenance },
  { id: 'F32', text: '空は晴れかもしれない。', expected: [kamo('かもしれない')], provenance },
  { id: 'F33', text: '花を見たい、空は青い。', expected: [tai('見たい')], provenance },
  { id: 'F34', text: 'ABC 🪴 葉は緑。', expected: [], provenance },
];
