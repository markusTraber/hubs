import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { CloseButton } from "../input/CloseButton";
import styles from "./IFrameIntroductionModal.scss";
import { Column } from "../layout/Column";
import { FormattedMessage } from "react-intl";
import { getLocale } from "../../utils/i18n";

export function IFrameIntroductionModal({ store, onClose }) {
  const [skipIframeIntroductionModalIsSet, setSkipIframeIntroductionModal] = useState(
    store.state.preferences.skipIframeIntroductionModal
  );

  const onCheckboxChange = useCallback(
    checked => {
      setSkipIframeIntroductionModal(checked);
      store.update({ preferences: { skipIframeIntroductionModal: checked } });
    },
    [store, setSkipIframeIntroductionModal]
  );

  return (
    <Modal
      title={<FormattedMessage id="iframe-introduction-modal.title" defaultMessage="Introduction" />}
      beforeTitle={<CloseButton onClick={onClose} />}
      className={styles.modal}
    >
      <Column padding center className={styles.content}>
        <iframe src={APP.introModalSettings.href.replace("{lang}", getLocale())} className={styles.iframe} />
        <div className="checkbox-container">
          <input
            id="checkbox-dont-show-again"
            type="checkbox"
            className="checkbox"
            checked={skipIframeIntroductionModalIsSet}
            onChange={e => onCheckboxChange(e.target.checked)}
          />
          <label>
            <FormattedMessage
              id="iframe-introduction-modal.skipModal"
              defaultMessage="Don't show this introduction again, when I enter a room."
            />
          </label>
        </div>
      </Column>
    </Modal>
  );
}

IFrameIntroductionModal.propTypes = {
  store: PropTypes.object,
  onClose: PropTypes.func
};
