import React from "react"
import Header from "../../components/header/header"
import Footer from "../../components/footer";

const tos = () => {
    return (
        <div className="dark:bg-slate-900 dark:text-white">
            <Header />
            <div className="py-12 px-10 sm:px-32 m-auto xl:max-w-7xl">
                <div>
                    <h1 className="text-2xl font-bold">AIPIC ガイドライン</h1>
                    <p className="pt-4">本ウェブサイト上で提供するサービス（以下,「本サービス」といいます。）における、ガイドラインについて、以下のとおりAIPIC ガイドライン（以下，「本ガイドライン」といいます。）を定めます。</p>
                </div>
                <div className="pt-8">
                    <h1 className="text-xl font-bold">規定</h1>
                    <p className="pt-4">運営者は、ガイドラインに基づき、下記のような規定を行います。なお、この規定は特に倫理団体等に則したものではなく、運営者が独自に設定したガイドラインですので社会・環境の変化によって運営者の判断で任意に変更されます。継続的にこれを保証するものではありませんのであらかじめご了承ください。</p>
                </div>
                <div className="pt-8">
                    <h1 className="text-xl font-bold">作品や画像に対する年齢制限の追加と削除に関して</h1>
                    <p className="pt-4">画像・テキスト（タイトル・キャプション・画像投稿機能を用いて投稿された文章主体の作品）を含めて作品として判断し、 年齢制限の追加・削除対象作品を運営者がフォームから情報をいただいたものから優先的にチェックいたします。</p>
                    <p className="pt-4">プロフィール画像・リクエストのプランカバー画像はどのユーザーからも閲覧が可能なため、年齢制限が必要な画像の設定を禁止いたします。また、下記の投稿禁止作品に該当する画像の投稿、設定も禁止します。</p>
                    <p className="pt-4">禁止の対象となる作品やプロフィール画像・リクエストのプランカバー画像を発見した場合、運営者の運営チームにて年齢制限の追加や作品・プロフィール画像・リクエストのプランカバー画像を削除し、下記の禁止行為を含む悪質な行為に対しては、会員IDの削除を行うことがあります。その理由について、お問い合わせいただいてもお答えできませんのでご了承ください。</p>
                </div>
                <div className="pt-8">
                    <h1 className="text-xl font-bold">禁止行為</h1>
                    <ol className="flex flex-col gap-2 pt-4 pl-8 list-disc">
                        <li>投稿禁止作品を大量・連続投稿する行為</li>
                        <li>中傷・脅迫・経済的もしくは精神的に損害や不利益を与えるタグ・コメント行為</li>
                        <li>作品内容に無関係なタグを付加する行為</li>
                        <li>不適切な宣伝または勧誘を目的としたコメントを投稿する行為</li>
                        <li>本サービスや他サイトから会員IDや作品IDを掲載し中傷する行為</li>
                        <li>クローラーなどのプログラムを使って作品を収集する行為</li>
                        <li>サーバに極端な負荷をかける行為</li>
                    </ol>
                </div>
                <div className="pt-8">
                    <h1 className="text-xl font-bold">対象年齢指定作品</h1>
                    <p className="pt-4">本サービスでは18歳未満の方の閲覧が不適切である作品に関して、年齢制限のチェックを必須とさせていただきます。</p>
                    <ol className="flex flex-col gap-2 pt-4 pl-8 list-disc">
                        <li>R-18: 性に関連したもの、あるいはそれを表現しており、性器の結・接合、あるいは性行為を想起させるものを表現してある作品</li>
                        <li>R-18G: 暴力的なシーンや、思想、模倣的表現ではあるが危険性が高い、または刺激性の強い作品</li>
                    </ol>
                    <p className="pt-4">以下に該当する作品は削除対象とします。</p>
                    <ol className="flex flex-col gap-2 pt-4 pl-8 list-disc">
                        <li>中傷・脅迫・経済的もしくは精神的に損害や不利益を与えるもの</li>
                        <li>性表現をいたずらに歪んだ状態で表現しているもの</li>
                        <li>刺激が非常に強く嫌悪感が強い暴力シーンを表現しているもの</li>
                        <li>いたずらに過度な思想を押し付けるもの</li>
                        <li>反社会的行為を賛美し、これを過度に助長しているもの</li>
                        <li>人種、信条、職業、性別、宗教などを不当に差別して表現しているもの</li>
                        <li>カルト的宗教活動、過度な政治活動を表現しているもの</li>
                        <li>過度な残虐シーン、刺激性をいたずらに誇張し、またはそれが模倣に結びつくと予想されるもの</li>
                        <li>明らかに幼児を対象とした性的表現がされているもの<br/>*隠蔽処理（モザイク等）が施されている場合は、社会通念上許される範囲でこの限りではありません</li>
                        <li>性器の表現、露出しているもの</li>
                        <li>性に関連して接合部等を異物にて表現、露出しているもの</li>
                        <li>実写を主体とした画像であるもの（※）</li>
                    </ol>
                </div>
                <div className="pt-8">
                    <h1 className="text-xl font-bold">隠蔽処理（モザイク処理）について</h1>
                    <ol className="flex flex-col gap-2 pt-4 pl-8 list-disc">
                        <li>基本的に隠蔽処理は画像の技術的性質ではなく、視覚的判断により細部が不明瞭になっていることを前提とする</li>
                        <li>同一次元上で処理を施し、技術的に元の表現に戻せない状態のものとする</li>
                        <li>範囲は輪郭線を含んだ状態とする</li>
                        <li>処理が施されていても透過により細部が明瞭になっているものは隠蔽に含まれない</li>
                        <li>モザイクは以下を参考に不明瞭化する</li>
                        <li>最小4ピクセル平方モザイクかつ画像全体の長辺が400ピクセル以上の場合、</li>
                        <li>必要部位に画像全体長辺x1/100程度を算出したピクセル平方モザイクとする</li>
                        <li>べた塗りにおいては隠蔽処理が必要な部分にすべて行うことが前提であるが、一部の処理により結果として不明瞭になる場合はこの限りではない</li>
                        <li>白液、その他隠蔽を絵柄により表現する場合、隠蔽処理が必要な部分にすべて行うことが前提であるが、一部の処理により結果として不明瞭になる場合はこの限りではない</li>
                        <li>隠蔽処理（モザイク処理）必要箇所の例</li>
                        <li>性器または性器を連想する部位</li>
                        <li>性器結合部位及び挿入部位</li>
                        <li>アヌス結合部位及び挿入部位</li>
                        <li>切断、裂傷等においていたずらに詳細かつ過度に表現されている部位</li>
                    </ol>
                </div>
                <p className="pt-4">また、本サービスは、AI生成作品専用の投稿サイトとなっています。制作過程にAIを用いてない作品の投稿はご遠慮ください。</p>
            </div>
            <Footer/>
        </div>
    )
}

export default tos