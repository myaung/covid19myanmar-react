import React, {useState, useEffect, useCallback} from 'react';
import {parse} from 'date-fns';
import * as Icon from 'react-feather';
import PatientsView from './patientsview';
import {useTranslation} from 'react-i18next';

function Patients(props) {
  const {t} = useTranslation();

  const [patients, setPatients] = useState(props.patients);
  const [patient, setPatient] = useState(props.patients.slice(-1));
  const [logs, setLogs] = useState({});
  const [modal, setModal] = useState(false);

  window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
      setModal(false);
    }
  };

  useEffect(() => {
    setPatients(props.patients);
  }, [props.patients]);

  useEffect(() => {
    if (modal) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open');
  }, [modal]);

  const parseByDate = useCallback((patients) => {
    const log = {};
    for (let i = 0; i < patients.length; i++) {
      const day = new Date(
        parse(patients[i].dateannounced, 'dd/MM/yyyy', new Date())
      );
      if (!(day in log)) {
        const list = [];
        list.push(patients[i]);
        log[day] = list;
      } else {
        const list = log[day];
        list.push(patients[i]);
        log[day] = list;
      }
    }
    setLogs(log);
  }, []);

  useEffect(() => {
    if (patients.length) {
      parseByDate(patients);
    }
  }, [parseByDate, patients]);

  const switchPatient = (patientIndex) => {
    if (patientIndex === '') return;
    try {
      // eslint-disable-next-line
      patients.map((patient, index) => {
        if (+patient.patientnumber === +patientIndex) setPatient(patient);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getClassNameFn = (colorMode) => {
    switch (colorMode) {
      case 'genders':
        return (patient) => {
          return `patient-card ${
            patient.gender === 'F'
              ? 'is-femme'
              : patient.gender === 'M'
              ? 'is-male'
              : ''
          } ${props.expand ? '' : 'is-small'}`;
        };
      case 'transmission':
        return (patient) => {
          return `patient-card ${
            patient.typeoftransmission === 'Local'
              ? 'is-local'
              : patient.typeoftransmission === 'Imported'
              ? 'is-imported'
              : ''
          } ${props.expand ? '' : 'is-small'}`;
        };
      case 'nationality':
        return (patient) => {
          return `patient-card ${
            patient.nationality === 'myanmar'
              ? 'is-mm'
              : patient.nationality === 'french'
              ? 'is-fr'
              : patient.nationality === 'swiz'
              ? 'is-ch'
              : patient.nationality === 'american'
              ? 'is-us'
              : ''
          } ${props.expand ? '' : 'is-small'}`;
        };
      case 'age':
        return (patient) => {
          return `patient-card ${props.expand ? '' : 'is-small'}`;
        };
      default:
        return (patient) => {
          return `patient-card ${props.expand ? '' : 'is-small'}`;
        };
    }
  };

  return (
    <React.Fragment>
      <PatientsView
        logs={logs}
        setModal={setModal}
        setPatient={setPatient}
        expand={props.expand}
        applyClass={getClassNameFn(props.colorMode)}
      />

      {modal && (
        <div className="modal" id="modal">
          <div
            className={`modal-content ${modal ? 'fadeInUp' : 'fadeOutDown'}`}
          >
            <div className="close-button">
              <Icon.XCircle
                onClick={() => {
                  setModal(false);
                }}
              />
            </div>

            <div className="modal-top">
              <h1>#{patient.patientnumber}</h1>
            </div>

            <div className="meta">
              <h5>{t("Date Announced")}</h5>
              <h3>{patient.dateannounced ? patient.dateannounced : '?'}</h3>

              <h5>{t("Contracted from")}</h5>
              <h3 className="contracted-from">
                {patient.contractedfromwhichpatientsuspected
                  ? patient.contractedfromwhichpatientsuspected.split(',').map((patientid, i) => {
                    return <span key={i} onClick={() => switchPatient(patientid)}>{patientid},</span>
                  })
                  : '?'}
              </h3>

              <h5>{t("Detected City")}</h5>
              <h3>{patient.detectedcity ? patient.detectedcity : '?'}</h3>

              <h5>{t("Detected District")}</h5>
              <h3>
                {patient.detecteddistrict ? patient.detecteddistrict : '?'}
              </h3>

              <h5>{t("Detected State")}</h5>
              <h3>{patient.detectedstate ? patient.detectedstate : '?'}</h3>

              <h5>{t("Nationality")}</h5>
              <h3>{patient.nationality ? patient.nationality : '?'}</h3>

              <h5>{t("Age")}</h5>
              <h3>{patient.agebracket ? patient.agebracket : '?'}</h3>

              <h5>{t("Gender")}</h5>
              <h3>{patient.gender ? patient.gender : '?'}</h3>

              <h5>{t("Type of transmission")}</h5>
              <h3>
                {patient.typeoftransmission ? patient.typeoftransmission : '?'}
              </h3>
            </div>

            <div className="notes">
              <h5>{t("Notes")}</h5>
              <h3>{patient.notes}</h3>
            </div>

            <h5>{t("Source 1")}</h5>
            <div className="link">
              <a href={patient.source1} target="_noblank">
                {patient.source1}
              </a>
            </div>

            <h5>{t("Source 2")}</h5>
            <div className="link">
              <a href={patient.source2} target="_noblank">
                {patient.source2}
              </a>
            </div>

            <h5>{t("Source 3")}</h5>
            <div className="link">
              <a href={patient.source3} target="_noblank">
                {patient.source3}
              </a>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default Patients;
