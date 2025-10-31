import { useCallback, useEffect, useState } from "react";
import { BusEvents, eventBus } from "../../utils/EventBus";
import { AnimatePresence, motion } from "motion/react";
import parchmentImage from "../../../public/final_parchment.png";

export function FinalSceneText() {
  const [show, setShow] = useState(false);

  const onShowScenarioEvent = useCallback(() => {
    console.log("show final");
    setShow(true);
  }, []);

  useEffect(() => {
    eventBus.on(BusEvents.SHOW_FINAL, onShowScenarioEvent);

    return () => {
      eventBus.off(BusEvents.SHOW_FINAL, onShowScenarioEvent);
    };
  }, [onShowScenarioEvent]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <motion.div
            className="relative flex flex-col items-center justify-center text-center p-10"
            style={{
              backgroundImage: `url(${parchmentImage})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
              width: "100vw", // makes parchment larger
              height: "100vh",
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 60 }}
          >
            <p className="text-3xl text-yellow-900 max-w-[850px] leading-relaxed medieval-title-text">
              Tre anni di litigate, arrabbiature, momenti tristi e poco belli
              MA,
              <br />
              {/* Insieme a tutto questo sono stati anche 3 anni di Amore, di
              Felicità, di Gioia, di Gioco, di Divertimento. Ripereteri tutto,
              dalla prima all'ultima cosa. Magari questa volta ti darei le
              ripetizioni di matematica... */}
              Insieme a tutto questo, sono stati anche tre anni di Amore, di Felicità, di Gioia, di
              Gioco e di Divertimento. Li ripeterei tutti, dalla prima
              all’ultima cosa. Magari, questa volta, ti darei io le ripetizioni
              di matematica...
              <br />
              {/* Mi hai fatto capire cosa vuol dire avere qualcuno accanto che mi
              Ami e mi Sostenga, sia nelle stupidaggini che nelle cose serie. */}
              Mi hai fatto capire cosa significa davvero
              avere accanto qualcuno che mi ama e mi sostiene, sia nelle
              stupidaggini che nelle cose più serie.
              <br />
              {/* Ci sei e ci sei sempre stata, e spero tanto di essere stato lo
              stesso per te. */}
              Ci sei, e ci sei sempre
              stata. Spero tanto di essere stato lo stesso per te.
              <br />
              Ti amo — e ti
              amerò ancora di più nei prossimi 3, 5, 10... 100.000.000 anni.
              <br />
              Grazie per essere la mia forza, la mia ispirazione, ciò che ogni
              giorno mi spinge a dare il meglio e a non arrendermi.
              <br />
              Grazie per questi splendidi, meravigliosi, felici, scherzosi (e a volte
              litigarelli) anni insieme.
              Con la certezza che ne verranno tanti, tantissimi altri.
             
               
                 
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
