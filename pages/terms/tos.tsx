import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Footer from "../../components/footer";
import Header from "../../components/header/header";

const Tos = () => {
  const { locale } = useRouter()
  if (locale === "en") {
    return (
        <div className="dark:bg-slate-900 dark:text-white">
          <Header />
          <div className="py-12 px-10 sm:px-32 m-auto xl:max-w-7xl">
            <div>
              <h1 className="text-2xl font-bold">Terms and Conditions</h1>
              <p className="pt-4">
              These Terms and Conditions defines the Terms and Conditions of use of the services provided on this site (&quot;Services&quot;). Registered users (hereinafter referred to as &quot;Users&quot;) are requested to comply these Terms and Conditions on using this Service.
              </p>
            </div>
            <div className="pt-8">
              <h1 className="text-xl font-bold">1.Application</h1>
              <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
                <li>
                These Terms and Conditions apply to all relationships between users and the operator of this site (hereinafter referred to as &quot;Operator&quot;) regarding the use of this site.
                </li>
                <li>
                  In addition to the Terms and Conditions, the Operator may stipulate various rules and regulations concerning the use of the Service (hereinafter referred to as &quot;Individual Regulations&quot;). These individual provisions, regardless of their names, shall constitute a part of these Terms of Use.
                </li>
                <li>
                  In the event of any inconsistency between the provisions of these Terms and Conditions and the individual provisions of the preceding Article, the provisions of the individual provisions shall prevail unless otherwise specified in the individual provisions.
                </li>
              </ol>
            </div>
            <div className="pt-8">
              <h1 className="text-xl font-bold">2.Registration</h1>
              <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
                <li>
                  In the case of the Service, the registration for use of the Service shall be completed when the applicant for registration applies for registration for use of the Service in accordance with the method prescribed by the Operator after agreeing to the Terms and Conditions, and when the Operator notifies the applicant for registration of the approval of the registration.
                </li>
                <li>
                  The Operator may not approve an application for registration of use if it determines that the applicant has any of the following reasons, and shall not be obliged to disclose any reasons for such denial.
                </li>
                <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
                  <li>If false information is reported when applying for user registration</li>
                  <li>If the application is from a person who has violated these Terms and Conditions</li>
                  <li>Other cases in which the Company deems the registration of use to be inappropriate</li>
                </ol>
              </ol>
            </div>
            <div className="pt-8">
              <h1 className="text-xl font-bold">
                3.User ID and password management
              </h1>
              <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
                <li>
                  The User shall properly manage his/her user ID and password for the Service at his/her own responsibility.
                </li>
                <li>
                  A user may not, under any circumstances, transfer or lend his/her user ID and password to a third party, or share them with a third party. When a user logs in with the same combination of user ID and password as the registered information, the Operator shall deem the use of the Service to be that of the user who has registered the user ID.
                </li>
                <li>
                  The Operator shall not be liable for any damage caused by the use of a user ID and password by a third party, unless such use is intentional or grossly negligent on the part of the Operator.
                </li>
              </ol>
            </div>
            <div className="pt-8">
              <h1 className="text-xl font-bold">4.Prohibited Acts</h1>
              <p className="pt-4">
                In using the Service, the User shall not engage in any of the following acts.
              </p>
              <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
                <li>Acts that violate laws and regulations or public order and morals</li>
                <li>Conduct related to criminal activity</li>
                <li>
                  Acts that destroy or interfere with the functions of the Operator&apos;s, other users of the Service, or third parties&apos; servers or networks
                </li>
                <li>Actions that may interfere with the operation of the Operator&apos;s services</li>
                <li>Collecting or accumulating personal information about other users.</li>
                <li>Unauthorized access or attempts to gain unauthorized access</li>
                <li>Impersonating another user</li>
                <li>
                  Acts of providing benefits directly or indirectly to antisocial forces in relation to the Operator&apos;s services.
                </li>
                <li>
                  Acts that infringe on the intellectual property rights, portrait rights, privacy, honor, or other rights or interests of the Operator, other users of the Service, or third parties
                </li>
                <li>
                  Posting or transmitting any content on the Service that includes or is deemed by the Operator to include any of the following expressions
                </li>
                <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
                  <li>Excessively violent expressions</li>
                  <li>Explicit sexual expression</li>
                  <li>
                    Expressions that lead to discrimination based on race, nationality, creed, sex, social status, family origin, etc.
                  </li>
                  <li>Expressions that induce or encourage suicide, self-harm, or drug abuse</li>
                  <li>Other expressions that include antisocial content and cause discomfort to others</li>
                </ol>
                <li>Any act of the following that the Operator deems to be the purpose</li>
                <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
                  <li>
                    Sales, advertising, publicity, solicitation, or any other commercial activities (except those approved by the Operator).
                  </li>
                  <li>Acts intended for sexual or obscene purposes</li>
                  <li>Actions for the purpose of meeting or dating members of the opposite sex whom you do not know.</li>
                  <li>Actions aimed at harassing or defaming other users</li>
                  <li>
                    Actions intended to cause disadvantage, damage, or discomfort to the Operator, other users of the Service, or third parties.
                  </li>
                  <li>
                    Any other use of the Service for purposes different from the intended purpose of use of the Service.
                  </li>
                </ol>
              </ol>
            </div>
            <div className="pt-8">
              <h1 className="text-xl font-bold">
                5.Suspension of the Service
              </h1>
              <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
                <li>
                  The Operator may suspend or discontinue the Service, in whole or in part, without prior notice to users, for any of the following reasons.
                </li>
                <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
                  <li>
                    When performing maintenance inspections or updating of computer systems related to this service
                  </li>
                  <li>
                    When it becomes difficult to provide this service due to force majeure such as earthquake, lightning, fire, power outage, or natural disasters.
                  </li>
                  <li>In the event of computer or communication line outage due to accident</li>
                  <li>In any other cases where the Operator deems it difficult to provide the Service.</li>
                </ol>
                <li>
                  The Operator shall not be liable for any disadvantage or damage incurred by users or third parties due to the suspension or interruption of the provision of the Service.
                </li>
              </ol>
            </div>
            <div className="pt-8">
              <h1 className="text-xl font-bold">6.Copyrights</h1>
              <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
                <li>
                  Users may only use the Service to post or upload text, images, videos, and other information for which they own the necessary intellectual property rights, such as copyrights, or have obtained the permission of the necessary right holders.
                </li>
                <li>
                  The copyrights of any text, images, videos, etc. posted or uploaded by users using the Service shall be reserved to the users concerned or other existing right holders. However, the Operator may use the text, images, videos, etc. posted or uploaded by users using the Service to the extent necessary for improving the Service, enhancing its quality, correcting deficiencies, etc., and publicizing the Service. The User shall not exercise his/her moral rights in connection with such use.
                </li>
                <li>
                  Except as provided in the preceding paragraph, all copyrights and other intellectual property rights to the Service and all information related to the Service shall belong to the Operator or to the right holders who have authorized the Operator to use them, and the User shall not copy, transfer, lend, translate, modify, reprint, publicly transmit (including making transmittable) or otherwise use the Service without permission.
                </li>
              </ol>
            </div>
            <div className="pt-8">
              <h1 className="text-xl font-bold">7.Restriction of Use and Cancellation of Registration</h1>
              <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
                <li>
                  The Operator may, without prior notice, delete posted data, restrict a user&apos;s use of all or part of the Service, or terminate the user&apos;s registration if any of the following applies to the user.
                </li>
                <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
                  <li>Violation of any of the provisions of these Terms and Conditions</li>
                  <li>When it is found that there is a false fact in the registration information</li>
                  <li>When there is no response from the Operator for a certain period of time</li>
                  <li>When there has been no use of this service for a certain period of time since the last use</li>
                  <li>
                    In any other cases in which the Operator deems the use of the Service to be inappropriate.
                  </li>
                </ol>
                <li>
                  If a user falls under any of the items of the preceding paragraph, the user shall naturally lose the benefit of time with respect to all debts owed to the Operator, and shall immediately repay all debts owed at that time in a lump sum.
                </li>
                <li>
                  The Operator shall not be liable for any damages incurred by users as a result of actions taken by the Operator pursuant to this Article.
                </li>
              </ol>
            </div>
            <div className="pt-8">
              <h1 className="text-xl font-bold">8.Withdrawal</h1>
              <p className="pt-4">
                A user may withdraw from the Service through the withdrawal procedure prescribed by the Operator.
              </p>
            </div>
            <div className="pt-8">
              <h1 className="text-xl font-bold">
                9.Disclaimer of Warranty and Disclaimer of Liability
              </h1>
              <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
                <li>
                  The Operator does not warrant, expressly or impliedly, that the Service is free from defects in fact or in law (including safety, reliability, accuracy, completeness, validity, fitness for a particular purpose, security or other defects, errors or bugs, infringement of rights, etc.). 
                </li>
                <li>
                  The Operator shall not be liable for any and all damages incurred by users as a result of the Service, except in cases of intentional or gross negligence on the part of the Operator.
                </li>
                <li>
                  The Operator shall not be liable for any transaction, communication, or dispute between a user and another user or a third party with respect to the Service.
                </li>
              </ol>
            </div>
            <div className="pt-8">
              <h1 className="text-xl font-bold">10.Change of Service Contents, etc.</h1>
              <p className="pt-4">
                The Operator may change, add, or discontinue the Service with prior notice to users, and users shall consent to such changes, additions, or discontinuation.
              </p>
            </div>
            <div className="pt-8">
              <h1 className="text-xl font-bold">11.Modification of Terms and Conditions</h1>
              <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
                <li>
                  The Operator may modify these Terms and Conditions without requiring individual user consent in the following cases
                </li>
                <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
                  <li>When the modification of these Terms and Conditions is compatible with the general interest of the User</li>
                  <li>
                    When the modification of these Terms and Condition is not contrary to the purpose of the Service Usage Agreement and is reasonable in light of the necessity of the modification, the reasonableness of the modified contents, and other circumstances pertaining to the modification.
                  </li>
                </ol>
                <li>
                  In amending these Terms and Conditions in accordance with the preceding paragraph, the Operator shall notify users in advance of the amendment, the content of the amended Terms and Conditions, and the effective date of the amendment.
                </li>
              </ol>
            </div>
            <div className="pt-8">
              <h1 className="text-xl font-bold">12.Handling of Personal Information</h1>
              <p className="pt-4">
                The Operator shall appropriately handle personal information obtained through the use of the Service in accordance with the Service&apos;s &quot;Privacy Policy&quot;.
              </p>
            </div>
            <div className="pt-8">
              <h1 className="text-xl font-bold">13.Notice and Communication</h1>
              <p className="pt-4">
                Notification or communication between a user and the Operator shall be made in the manner prescribed by the Operator. Unless a user notifies the Operator of any change in the contact information in accordance with the method separately prescribed by the Operator, the Operator shall deem the currently registered contact information to be valid and shall send notices or communications to such contact information, which shall be deemed to have reached the user at the time of transmission.
              </p>
            </div>
            <div className="pt-8">
              <h1 className="text-xl font-bold">14.Prohibition of Assignment of Rights and Obligations</h1>
              <p className="pt-4">
                A user may not assign its position under the Service Agreement or its rights or obligations under these Terms and Conditions to a third party or offer them as security without the Operator&apos;s prior written consent.
              </p>
            </div>
            <div className="pt-8">
              <h1 className="text-xl font-bold">15.Governing Law and Jurisdiction</h1>
              <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
                <li>If there is any conflict in this <Link href="/en/terms/tos"><a className="text-sky-600">English version of the Terms and Conditions</a></Link> and the <Link href="/jp/terms/tos"><a className="text-sky-600">Japanese version of Terms and Conditions</a></Link>, the Japanese Terms and Conditions will be always prioritized.</li>
                <li>These Terms and Conditions shall be governed by and construed in accordance with the laws of Japan.</li>
                <li>
                  Any disputes arising in connection with the Service shall be subject to the exclusive jurisdiction of the court having jurisdiction over the location of the Operator.
                </li>
              </ol>
            </div>
          </div>
          <Footer />
        </div>
      );
  }
  return (
    <div className="dark:bg-slate-900 dark:text-white">
      <Header />
      <div className="py-12 px-10 sm:px-32 m-auto xl:max-w-7xl">
        <div>
          <h1 className="text-2xl font-bold">利用規約</h1>
          <p className="pt-4">
            この利用規約（以下，「本規約」といいます。）は、当サイト上で提供するサービス（以下，「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。
          </p>
        </div>
        <div className="pt-8">
          <h1 className="text-xl font-bold">第1条（適用）</h1>
          <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
            <li>
              本規約は，ユーザーと運営者との間の本サービスの利用に関わる一切の関係に適用されるものとします。
            </li>
            <li>
              運営者は本サービスに関し，本規約のほか，ご利用にあたってのルール等，各種の定め（以下，「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず，本規約の一部を構成するものとします。
            </li>
            <li>
              本規約の規定が前条の個別規定の規定と矛盾する場合には，個別規定において特段の定めなき限り，個別規定の規定が優先されるものとします。
            </li>
          </ol>
        </div>
        <div className="pt-8">
          <h1 className="text-xl font-bold">第2条（利用登録）</h1>
          <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
            <li>
              本サービスにおいては，登録希望者が本規約に同意の上，運営者の定める方法によって利用登録を申請し，運営者がこの承認を登録希望者に通知することによって，利用登録が完了するものとします。
            </li>
            <li>
              運営者は，利用登録の申請者に以下の事由があると判断した場合，利用登録の申請を承認しないことがあり，その理由については一切の開示義務を負わないものとします。
            </li>
            <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
              <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
              <li>本規約に違反したことがある者からの申請である場合</li>
              <li>その他，当社が利用登録を相当でないと判断した場合</li>
            </ol>
          </ol>
        </div>
        <div className="pt-8">
          <h1 className="text-xl font-bold">
            第3条（ユーザーIDおよびパスワードの管理）
          </h1>
          <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
            <li>
              ユーザーは，自己の責任において，本サービスのユーザーIDおよびパスワードを適切に管理するものとします。
            </li>
            <li>
              ユーザーは，いかなる場合にも，ユーザーIDおよびパスワードを第三者に譲渡または貸与し，もしくは第三者と共用することはできません。運営者は，ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には，そのユーザーIDを登録しているユーザー自身による利用とみなします。
            </li>
            <li>
              ユーザーID及びパスワードが第三者によって使用されたことによって生じた損害は，運営者に故意又は重大な過失がある場合を除き，運営者は一切の責任を負わないものとします。
            </li>
          </ol>
        </div>
        <div className="pt-8">
          <h1 className="text-xl font-bold">第4条（禁止事項）</h1>
          <p className="pt-4">
            ユーザーは，本サービスの利用にあたり，以下の行為をしてはなりません。
          </p>
          <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>
              運営者，本サービスの他のユーザー，または第三者のサーバーまたはネットワークの機能を破壊したり，妨害したりする行為
            </li>
            <li>運営者のサービスの運営を妨害するおそれのある行為</li>
            <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
            <li>不正アクセスをし，またはこれを試みる行為</li>
            <li>他のユーザーに成りすます行為</li>
            <li>
              運営者のサービスに関連して，反社会的勢力に対して直接または間接に利益を供与する行為
            </li>
            <li>
              運営者，本サービスの他のユーザーまたは第三者の知的財産権，肖像権，プライバシー，名誉その他の権利または利益を侵害する行為
            </li>
            <li>
              以下の表現を含み，または含むと運営者が判断する内容を本サービス上に投稿し，または送信する行為
            </li>
            <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
              <li>過度に暴力的な表現</li>
              <li>露骨な性的表現</li>
              <li>
                人種，国籍，信条，性別，社会的身分，門地等による差別につながる表現
              </li>
              <li>自殺，自傷行為，薬物乱用を誘引または助長する表現</li>
              <li>その他反社会的な内容を含み他人に不快感を与える表現</li>
            </ol>
            <li>以下を目的とし，または目的とすると運営者が判断する行為</li>
            <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
              <li>
                営業，宣伝，広告，勧誘，その他営利を目的とする行為（運営者の認めたものを除きます。）
              </li>
              <li>性行為やわいせつな行為を目的とする行為</li>
              <li>面識のない異性との出会いや交際を目的とする行為</li>
              <li>他のユーザーに対する嫌がらせや誹謗中傷を目的とする行為</li>
              <li>
                運営者，本サービスの他のユーザー，または第三者に不利益，損害または不快感を与えることを目的とする行為
              </li>
              <li>
                その他本サービスが予定している利用目的と異なる目的で本サービスを利用する行為
              </li>
            </ol>
          </ol>
        </div>
        <div className="pt-8">
          <h1 className="text-xl font-bold">
            第5条（本サービスの提供の停止等）
          </h1>
          <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
            <li>
              運営者は，以下のいずれかの事由があると判断した場合，ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
            </li>
            <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
              <li>
                本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
              </li>
              <li>
                地震，落雷，火災，停電または天災などの不可抗力により，本サービスの提供が困難となった場合
              </li>
              <li>コンピュータまたは通信回線等が事故により停止した場合</li>
              <li>その他，運営者が本サービスの提供が困難と判断した場合</li>
            </ol>
            <li>
              運営者は，本サービスの提供の停止または中断により，ユーザーまたは第三者が被ったいかなる不利益または損害についても，一切の責任を負わないものとします。
            </li>
          </ol>
        </div>
        <div className="pt-8">
          <h1 className="text-xl font-bold">第6条（著作権）</h1>
          <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
            <li>
              ユーザーは，自ら著作権等の必要な知的財産権を有するか，または必要な権利者の許諾を得た文章，画像や映像等の情報に関してのみ，本サービスを利用し，投稿ないしアップロードすることができるものとします。
            </li>
            <li>
              ユーザーが本サービスを利用して投稿ないしアップロードした文章，画像，映像等の著作権については，当該ユーザーその他既存の権利者に留保されるものとします。ただし，運営者は，本サービスを利用して投稿ないしアップロードされた文章，画像，映像等について，本サービスの改良，品質の向上，または不備の是正等ならびに本サービスの周知宣伝等に必要な範囲で利用できるものとし，ユーザーは，この利用に関して，著作者人格権を行使しないものとします。
            </li>
            <li>
              前項本文の定めるものを除き，本サービスおよび本サービスに関連する一切の情報についての著作権およびその他の知的財産権はすべて運営者または運営者にその利用を許諾した権利者に帰属し，ユーザーは無断で複製，譲渡，貸与，翻訳，改変，転載，公衆送信（送信可能化を含みます。），伝送，配布，出版，営業使用等をしてはならないものとします。
            </li>
          </ol>
        </div>
        <div className="pt-8">
          <h1 className="text-xl font-bold">第7条（利用制限および登録抹消）</h1>
          <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
            <li>
              運営者は，ユーザーが以下のいずれかに該当する場合には，事前の通知なく，投稿データを削除し，ユーザーに対して本サービスの全部もしくは一部の利用を制限しまたはユーザーとしての登録を抹消することができるものとします。
            </li>
            <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
              <li>本規約のいずれかの条項に違反した場合</li>
              <li>登録事項に虚偽の事実があることが判明した場合</li>
              <li>運営者からの連絡に対し，一定期間返答がない場合</li>
              <li>本サービスについて，最終の利用から一定期間利用がない場合</li>
              <li>
                その他，運営者が本サービスの利用を適当でないと判断した場合
              </li>
            </ol>
            <li>
              前項各号のいずれかに該当した場合，ユーザーは，当然に運営者に対する一切の債務について期限の利益を失い，その時点において負担する一切の債務を直ちに一括して弁済しなければなりません。
            </li>
            <li>
              運営者は，本条に基づき運営者が行った行為によりユーザーに生じた損害について，一切の責任を負いません。
            </li>
          </ol>
        </div>
        <div className="pt-8">
          <h1 className="text-xl font-bold">第8条（退会）</h1>
          <p className="pt-4">
            ユーザーは，運営者の定める退会手続により，本サービスから退会できるものとします。
          </p>
        </div>
        <div className="pt-8">
          <h1 className="text-xl font-bold">
            第9条（保証の否認および免責事項）
          </h1>
          <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
            <li>
              運営者は，本サービスに事実上または法律上の瑕疵（安全性，信頼性，正確性，完全性，有効性，特定の目的への適合性，セキュリティなどに関する欠陥，エラーやバグ，権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
            </li>
            <li>
              運営者は，本サービスに起因してユーザーに生じたあらゆる損害について、運営者の故意又は重過失による場合を除き、一切の責任を負いません。
            </li>
            <li>
              運営者は，本サービスに関して，ユーザーと他のユーザーまたは第三者との間において生じた取引，連絡または紛争等について一切責任を負いません。
            </li>
          </ol>
        </div>
        <div className="pt-8">
          <h1 className="text-xl font-bold">第10条（サービス内容の変更等）</h1>
          <p className="pt-4">
            運営者は，ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。
          </p>
        </div>
        <div className="pt-8">
          <h1 className="text-xl font-bold">第11条（利用規約の変更）</h1>
          <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
            <li>
              運営者は以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができるものとします。
            </li>
            <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
              <li>本規約の変更がユーザーの一般の利益に適合するとき。</li>
              <li>
                本規約の変更が本サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき。
              </li>
            </ol>
            <li>
              運営者はユーザーに対し、前項による本規約の変更にあたり、事前に、本規約を変更する旨及び変更後の本規約の内容並びにその効力発生時期を通知します。
            </li>
          </ol>
        </div>
        <div className="pt-8">
          <h1 className="text-xl font-bold">第12条（個人情報の取扱い）</h1>
          <p className="pt-4">
            運営者は，本サービスの利用によって取得する個人情報については，運営者「プライバシーポリシー」に従い適切に取り扱うものとします。
          </p>
        </div>
        <div className="pt-8">
          <h1 className="text-xl font-bold">第13条（通知または連絡）</h1>
          <p className="pt-4">
            ユーザーと運営者との間の通知または連絡は，運営者の定める方法によって行うものとします。運営者は,ユーザーから,運営者が別途定める方式に従った変更届け出がない限り,現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い,これらは,発信時にユーザーへ到達したものとみなします。
          </p>
        </div>
        <div className="pt-8">
          <h1 className="text-xl font-bold">第14条（権利義務の譲渡の禁止）</h1>
          <p className="pt-4">
            ユーザーは，運営者の書面による事前の承諾なく，利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し，または担保に供することはできません。
          </p>
        </div>
        <div className="pt-8">
          <h1 className="text-xl font-bold">第15条（準拠法・裁判管轄）</h1>
          <ol className="flex flex-col gap-2 pt-4 pl-8 list-decimal">
            <li>本規約の解釈にあたっては，日本法を準拠法とします。</li>
            <li>
              本サービスに関して紛争が生じた場合には，運営者の所在地を管轄する裁判所を専属的合意管轄とします。
            </li>
          </ol>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Tos;
