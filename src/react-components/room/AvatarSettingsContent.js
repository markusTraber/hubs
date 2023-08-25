import React from "react";
import PropTypes from "prop-types";
import { Button, AcceptButton } from "../input/Button";
import styles from "./AvatarSettingsContent.scss";
import { TextInputField } from "../input/TextInputField";
import { Column } from "../layout/Column";
import { FormattedMessage } from "react-intl";
import rpmPreviewBackground from "../../assets/readyPlayerMe/rpm-preview.png";

export function AvatarSettingsContent({
  displayName,
  displayNameInputRef,
  disableDisplayNameInput,
  onChangeDisplayName,
  avatarPreview,
  displayNamePattern,
  onChangeAvatar,
  onCreateRpmAvatar,
  ...rest
}) {
  const showRpmOption = true; // TODO: implement with admin interface?
  return (
    <Column as="form" className={styles.content} {...rest}>
      <TextInputField
        disabled={disableDisplayNameInput}
        label={<FormattedMessage id="avatar-settings-content.display-name-label" defaultMessage="Display Name" />}
        value={displayName}
        pattern={displayNamePattern}
        spellCheck="false"
        required
        onChange={onChangeDisplayName}
        description={
          <FormattedMessage
            id="avatar-settings-content.display-name-description"
            defaultMessage="Alphanumerics, hyphens, underscores, and tildes. At least 3 characters, no more than 32"
          />
        }
        ref={displayNameInputRef}
      />
      {/* <div className={styles.avatarPreviewContainer}>
        {avatarPreview || <div />}
        <Button type="button" preset="basic" onClick={onChangeAvatar}>
          <FormattedMessage id="avatar-settings-content.change-avatar-button" defaultMessage="Change Avatar" />
        </Button>
      </div> */}
      <div className={styles.flexWrapper}>
        {showRpmOption && (
          <div className={styles.avatarPreviewContainer}>
            <div>
              <img
                src={rpmPreviewBackground}
                alt={
                  <FormattedMessage
                    id="avatar-settings-content.readyplayerme.avatar.preview"
                    defaultMessage="ReadyPlayerMe Avatar Preview"
                  />
                }
              />
            </div>
            <Button type="button" preset="basic" onClick={onCreateRpmAvatar}>
              <FormattedMessage id="media-browser.create-avatar" defaultMessage="Create Avatar" />
            </Button>
          </div>
        )}
        <div className={styles.avatarPreviewContainer}>
          {avatarPreview || <div />}
          <Button type="button" preset="basic" onClick={onChangeAvatar}>
            <FormattedMessage id="avatar-settings-content.change-avatar-button" defaultMessage="Select Avatar" />
          </Button>
        </div>
      </div>
      <AcceptButton preset="accept" type="submit" />
    </Column>
  );
}

AvatarSettingsContent.propTypes = {
  className: PropTypes.string,
  displayName: PropTypes.string,
  displayNameInputRef: PropTypes.func,
  disableDisplayNameInput: PropTypes.bool,
  displayNamePattern: PropTypes.string,
  onChangeDisplayName: PropTypes.func,
  avatarPreview: PropTypes.node,
  onChangeAvatar: PropTypes.func,
  onCreateRpmAvatar: PropTypes.func
};
