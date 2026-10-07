/**
 * Credit for the suburb list used in every questionnaire's postcode box (GeoNames, CC BY 4.0: the licence asks for a
 * visible credit). Moved from under the postcode box to the footers' small print (owner, 7 Oct 2026).
 */
export default function DataCredit({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      Suburb data © <a href="https://www.geonames.org/" target="_blank" rel="noopener noreferrer" className="underline">GeoNames</a> (CC BY 4.0)
    </span>
  );
}
