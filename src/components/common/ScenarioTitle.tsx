import { useCallback, useEffect, useState } from "react";
import { BusEvents, eventBus } from "../../utils/EventBus";
import { AnimatePresence, motion } from "motion/react";

export function ScenarioTitle() {
  const [show, setShow] = useState(false);
  const [titleText, setTitleText] = useState<string>();
  const [subtitleText, setSubtitleText] = useState<string>();

  const onShowTitleEvent = useCallback((text: string, subTitle?: string) => {
    setShow(true);
    setTitleText(text);
    setSubtitleText(subTitle);

    setTimeout(() => {
      eventBus.emit(BusEvents.TITLE_ANIMATION_END);
      setShow(false);
      setTitleText(undefined);
      setSubtitleText(undefined);
    }, 3000);
  }, []);

  useEffect(() => {
    eventBus.on(BusEvents.SHOW_TITLE, onShowTitleEvent);

    return () => {
      eventBus.off(BusEvents.SHOW_TITLE, onShowTitleEvent);
    };
  }, [onShowTitleEvent]);

  return show ? (
    <AnimatePresence>
      {!!titleText && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            className="h-[200px] min-w-[500px] flex justify-center items-center flex-col"
            initial={{ scale: 0.8 }}
            style={{
              backgroundImage: `url("parchment.png")`,
              backgroundPosition: "center",
            }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 60 }}
          >
            <h1 className="relative z-10 text-2xl text-yellow-800 w-[350px] text-center medieval-title-text">
              {titleText}
            </h1>
            {!!subtitleText && (
              <p className="medieval-title-text text-xl text-yellow-800 mb-[24px]">
                {subtitleText}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  ) : null;
}
