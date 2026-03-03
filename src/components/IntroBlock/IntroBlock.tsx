import styles from "./IntroBlock.module.css";

function calculateAge(birthDate: Date): number {
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export default function IntroBlock() {
  const birthDate = new Date("2004-04-23");
  const age = calculateAge(birthDate);

  return (
    <div className={styles.block}>
        <ul>
          <li>Antoine</li>
          <li>{age} ans</li>
          <li>Permis B en cours</li>
          <li>Picardie, Normandie</li>
        </ul>
    </div>
  );
}