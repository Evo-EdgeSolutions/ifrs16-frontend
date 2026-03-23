import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { AmortizationTables } from '../features/leaseCalculator/components/amortizationTables/AmortizationTables';
import { CalcForm } from '../features/leaseCalculator/components/calcForm/CalcForm';
import { CalcJournalEntries } from '../features/leaseCalculator/components/calcJournalEntries/CalcJournalEntries';
import { CalcResult } from '../features/leaseCalculator/components/calcResult/CalcResult';
import styles from './page.module.scss';

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.calculatorLayout}>
          <div className={styles.leftColumn}>
            <CalcForm />
          </div>
          <div className={styles.rightColumn}>
            <CalcResult />
          </div>
        </div>
        <div className={styles.tablesLayout}>
           <AmortizationTables />
        </div>
      <div className={styles.tablesLayout} style={{ marginTop: '2rem' }}>
           <CalcJournalEntries />
        </div>
      </main>
       <Footer />
    </>
  );
}