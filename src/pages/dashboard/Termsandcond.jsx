const TermsandCond = () => {
  return (
    <div className="h-screen overflow-y-auto bg-[#F7F6F0] p-4 font-sans text-[#4a4642] md:p-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#EC6345]">
        Contract Rules
      </h1>

      <div className="mx-auto max-w-4xl space-y-6 rounded-[18px] border border-[#e5ded3] bg-white p-5 leading-relaxed shadow-[0_20px_45px_-38px_rgba(39,39,39,0.55)] md:p-8">
        <section>
          <h2 className="text-xl font-semibold mb-2 text-[#333333]">
            1. Task Reset
          </h2>
          <p>
            To reset a task, you must complete the current task first. The
            account balance must be at least{" "}
            <span className="font-semibold text-[#EC6345]">$100</span>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Data Submission</h2>
          <p>
            Each user must complete all music album data submission tasks before
            meeting system withdrawal requirements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Withdrawals</h2>
          <p>
            To avoid capital loss, all withdrawals are processed automatically
            by the system, not manually.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Fund Safety</h2>
          <p>
            User funds are completely safe on the platform. The platform will be
            liable for any accidental losses.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Password & Security</h2>
          <ul className="list-disc list-inside">
            <li>
              Do not disclose your account password and security code. The
              platform is not responsible for any losses caused by disclosure.
            </li>
            <li>
              Users should properly secure their accounts to avoid leakage. The
              platform is not responsible for accidental leaks.
            </li>
            <li>
              Avoid weak passwords such as birthdays, ID numbers, or phone
              numbers. Use a complex password to protect your funds.
            </li>
            <li>
              If you forget your password, reset it by contacting online
              customer service and update it immediately afterward.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Account Protection</h2>
          <p>
            If the account balance exceeds{" "}
            <span className="font-semibold text-[#EC6345]">$50,000</span> and the
            wrong transaction password is entered more than 3 times, the account
            will enter protection mode. To release it, a deposit of 30%–50% of
            the total account balance is required, ensuring fund security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">7. Task Assignment</h2>
          <ul className="list-disc list-inside">
            <li>
              Music album data submission tasks are randomly assigned by the
              system and cannot be changed, canceled, or skipped.
            </li>
            <li>
              Due to the large number of users, data tasks cannot be manually
              adjusted.
            </li>
            <li>
              The system randomly releases ordinary and combination albums.
              Users may receive 1–3 albums in a combination task.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">8. Legal Compliance</h2>
          <p>Legal action will be taken if the account is misused.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">9. Deposits</h2>
          <p>
            Each work is provided by a different record company. Deposits must
            not exceed 30 minutes and must be confirmed with customer service to
            verify the company’s encrypted address. The platform is not
            responsible for deposits sent to the wrong account.
          </p>
        </section>

        <section className="md:mb-2 mb-52">
          <h2 className="text-xl font-semibold mb-2">
            10. Task Completion & Credit Score
          </h2>
          <ul className="list-disc list-inside">
            <li>
              Users must complete and withdraw funds within 24 hours. Failure to
              do so without notifying the record company of an extension may
              result in complaints and a breach of contract.
            </li>
            <li>
              Long-term extensions will lower a user&apos;s credit score. Accounts
              with a score below 100 must be repaired before withdrawals.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">11. Task Abandonment</h2>
          <p>
            If you choose to give up or quit during the submission of the task
            music album, you will not be able to apply for a withdrawal or
            refund.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">12. Excess Withdrawal</h2>
          <p>
            If you withdraw excess funds, your account will be frozen and you
            will need to upgrade to the corresponding VIP level to unfreeze the
            account and withdraw all funds.
          </p>
        </section>

        <section className="md:mb-2 mb-52">
          <h2 className="text-xl font-semibold mb-2">13. Tax Regulations</h2>
          <p>
            According to the regulations of different regional governments on
            our platform, all users with personal funds exceeding 50,000
            USDT/USDC are required to pay personal income tax of 20%-40% of the
            account funds before the withdrawal is processed, but the personal
            income tax will be refunded to your work account 2 hours after the
            withdrawal is completed.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsandCond;


