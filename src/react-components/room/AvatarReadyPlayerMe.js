import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./AvatarReadyPlayerMe.scss";
import styleUtils from "../styles/style-utils.scss";
import { FormattedMessage } from "react-intl";
import { BackButton } from "../input/BackButton";
import { CloseButton } from "../input/CloseButton";
import { Button } from "../input/Button";
import { FullscreenLayout } from "../layout/FullscreenLayout";
import { Row } from "../layout/Row";
import { Column } from "../layout/Column";
import { proxiedUrlFor } from "../../utils/media-url-utils";
import configs from "../../utils/configs";

export function AvatarReadyPlayerMe({ store, onClose, closeMediaBrowser, isIndependentDialog = true }) {
  // frame API https://docs.readyplayer.me/ready-player-me/integration-guides/web
  const iframeURL = "https://demo.readyplayer.me/avatar?frameApi&bodyType=halfbody";
  const [accepted, setAccepted] = useState(false);
  const companyName = configs.translation("company-name") || "Company-Name";

  const closeBack = useCallback(
    (evt, isSuccess = false) => {
      if (!isIndependentDialog && isSuccess) {
        console.log("closeMediaBrowser");
        closeMediaBrowser();
      }
      onClose();
    },
    [onClose, closeMediaBrowser, isIndependentDialog]
  );

  const onSuccess = useCallback(
    ({ url }) => {
      const scene = document.querySelector("a-scene");

      store.update({ profile: { ...store.state.profile, ...{ avatarId: url } } });
      scene.emit("avatar_updated");
      closeBack(null, true);
    },
    [closeBack, store]
  );

  const onBtnAccepted = useCallback(() => {
    setAccepted(true);
    // set store
    store.update({ activity: { hasAcceptedRpmAvatarNotice: true } });
  }, [setAccepted, store]);

  useEffect(() => {
    // get store value for accepted
    setAccepted(store.state.activity.hasAcceptedRpmAvatarNotice);

    function receiveMessage(event) {
      // Check if the received message is a string and a glb url
      // if not ignore it, and print details to the console
      if (typeof event.data === "string" && event.data.startsWith("https://") && event.data.endsWith(".glb")) {
        const url = proxiedUrlFor(event.data + "?v=" + new Date().getTime()); // add a timestamp to the url to prevent caching
        onSuccess({ url });
      } else {
        console.warn(`Received message from unknown source: ${event.data}`);
      }
    }
    window.addEventListener("message", receiveMessage, false);

    return () => {
      window.removeEventListener("message", receiveMessage, false);
    };
  }, [onSuccess, setAccepted, store]);

  return (
    <FullscreenLayout
      headerLeft={isIndependentDialog ? <CloseButton onClick={closeBack} /> : <BackButton onClick={closeBack} />}
      headerCenter={
        <>
          <h3>
            <FormattedMessage id="avatar.readyplayerme.dialog.title" defaultMessage="Create an avatar" />
          </h3>
        </>
      }
      //   headerRight={}
    >
      {accepted ? (
        <Column grow padding center className={styles.content}>
          <iframe src={iframeURL} className={styles.iframe} allow="camera *; microphone *" />
        </Column>
      ) : (
        <Row breakpointColumn="md">
          <div className={classNames([styles.content, styleUtils.flexBasis20])} />
          <Column padding="xl" center className={classNames([styles.content, styles.notice])}>
            <p>
              <FormattedMessage
                id="avatar.readyplayerme.dialog.notice.infoTerms"
                defaultMessage="We will now redirect you to ReadyPlayerMe for the creation of your avatar. Here you can find RPM's <a1>privacy policy</a1> and <a2>terms of use</a2>. After creating the avatar, the avatar data will be delivered back to {organisation}."
                values={{
                  // eslint-disable-next-line react/display-name
                  a1: chunks => (
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      className={styles.link}
                      href="https://readyplayer.me/privacy"
                    >
                      {chunks}
                    </a>
                  ),
                  // eslint-disable-next-line react/display-name
                  a2: chunks => (
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      className={styles.link}
                      href="https://readyplayer.me/terms"
                    >
                      {chunks}
                    </a>
                  ),
                  organisation: companyName
                }}
              />
            </p>
            <p>
              <FormattedMessage
                id="avatar.readyplayerme.dialog.notice.infoAccept"
                defaultMessage='If you click the "Yes, agree" button, then you agree to it.'
              />
            </p>
            <Button preset="primary" onClick={onBtnAccepted}>
              <FormattedMessage id="avatar.readyplayerme.dialog.notice.acceptBtn" defaultMessage="Yes, I agree." />
            </Button>
          </Column>
          <div className={classNames([styles.content, styleUtils.flexBasis20])} />
        </Row>
      )}
    </FullscreenLayout>
  );
}

AvatarReadyPlayerMe.propTypes = {
  store: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  closeMediaBrowser: PropTypes.func,
  isIndependentDialog: PropTypes.bool
};

AvatarReadyPlayerMe.defaultProps = {
  noResultsMessage: "No Results"
};
