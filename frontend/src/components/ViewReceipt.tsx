import { Receipt } from "@/entities"
import styles from "@/styles/ViewReceipt.module.scss"

function ViewReceipt({ receipt }: { receipt: Receipt }) {
  return (
    <div className={styles.container}>
      <div className={styles.med}>
        {receipt.medication.map((med) => (
          <div key={med.mid}>
            <span className={styles.quantity}>{med.quantity}x</span>
            <span className={styles.name}>{med.name}</span>
            <span className={styles.price}>${med.price}</span>
          </div>
        ))}
      </div>
      <div className={styles.total}>Total: ${receipt.total_fee}</div>
    </div>
  )
}

export default ViewReceipt
