import TimeSeries from './timeseries';
import {localizedStateName} from '../utils/commonfunctions';

import React from 'react';
import * as Icon from 'react-feather';
import {useLocalStorage} from 'react-use';
import {useTranslation} from 'react-i18next';

function TimeSeriesExplorer({
  timeseries,
  activeStateCode,
  onHighlightState,
  states,
  anchor,
  setAnchor,
}) {
  const {t} = useTranslation();
  const [graphOption, setGraphOption] = useLocalStorage(
    'timeseriesGraphOption',
    1
  );

  const [timeseriesMode, setTimeseriesMode] = useLocalStorage(
    'timeseriesMode',
    true
  );
  const [timeseriesLogMode, setTimeseriesLogMode] = useLocalStorage(
    'timeseriesLogMode',
    false
  );

  return (
    <div
      className={`TimeSeriesExplorer ${
        anchor === 'timeseries' ? 'stickied' : ''
      }`}
      style={{display: anchor === 'mapexplorer' ? 'none' : ''}}
    >
      <div
        className="timeseries-header fadeInUp"
        style={{animationDelay: '2.5s'}}
      >
        {window.innerWidth > 769 && anchor !== undefined && (
          <div
            className={`anchor ${anchor === 'timeseries' ? 'stickied' : ''}`}
            onClick={() => {
              setAnchor(anchor === 'timeseries' ? null : 'timeseries');
            }}
          >
            <Icon.Anchor />
          </div>
        )}

        <h1>{t("Spread Trends")}</h1>
        <div className="tabs">
          <div
            className={`tab ${graphOption === 1 ? 'focused' : ''}`}
            onClick={() => {
              setGraphOption(1);
            }}
          >
            <h4>{t("Cumulative")}</h4>
          </div>
          <div
            className={`tab ${graphOption === 2 ? 'focused' : ''}`}
            onClick={() => {
              setGraphOption(2);
            }}
          >
            <h4>{t("Daily")}</h4>
          </div>
        </div>

        <div className="scale-modes">
          <label className="main">{t("Scale Modes")}</label>
          <div className="timeseries-mode">
            <label htmlFor="timeseries-mode">{t("chart.mode.uniform")}</label>
            <input
              id="timeseries-mode"
              type="checkbox"
              checked={timeseriesMode}
              className="switch"
              aria-label="Checked by default to scale uniformly."
              onChange={(event) => {
                setTimeseriesMode(!timeseriesMode);
              }}
            />
          </div>
          <div
            className={`timeseries-logmode ${
              graphOption !== 1 ? 'disabled' : ''
            }`}
          >
            <label htmlFor="timeseries-logmode">{t("chart.mode.logarithmic")}</label>
            <input
              id="timeseries-logmode"
              type="checkbox"
              checked={graphOption === 1 && timeseriesLogMode}
              className="switch"
              disabled={graphOption !== 1}
              onChange={(event) => {
                setTimeseriesLogMode(!timeseriesLogMode);
              }}
            />
          </div>
        </div>

        {states && (
          <div className="trends-state-name">
            <select
              value={activeStateCode}
              onChange={({target}) => {
                const selectedState = target.selectedOptions[0].getAttribute(
                  'statedata'
                );
                onHighlightState(JSON.parse(selectedState));
              }}
            >
              {states.map((s) => {
                return (
                  <option
                    value={s.statecode}
                    key={s.statecode}
                    statedata={JSON.stringify(s)}
                  >
                    {s.statecode === 'TT' ? t('All States') : localizedStateName(s.state)}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      <TimeSeries
        timeseries={timeseries}
        type={graphOption}
        mode={timeseriesMode}
        logMode={timeseriesLogMode}
        isTotal={activeStateCode === 'TT'}
      />
    </div>
  );
}

export default React.memo(TimeSeriesExplorer);
