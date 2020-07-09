import React, { useState, useRef, useEffect } from 'react';

const PasswordPannel = ({ isAllowed, setIsAllowed }) => {
  const [ isModify, setIsModify ] = useState(false);
  const [ oldPass, setOldPass ] = useState('');
  const [ newPass, setNewPass ] = useState('');

  const passwordRef = useRef(null);

  const [ IP, setIP ] = useState('');

  useEffect(() => {
    Meteor.call('ip_get', (err, ip) => {
      setIP(ip);
    });
  }, []);

  return(
    <div style={{...styles.screen, display: isAllowed ? 'none' : 'flex'}}>
      <div style={{position: 'absolute', top: 0, width: '100%', padding: 15, color: 'rgba(1, 1, 1, 1)', textAlign: 'center', fontSize: 14, backgroundColor: 'rgba( 255, 255, 255, 0.8)'}}>
        <b>http://{ IP }/screens/<span style={{color: '#d11d1d'}}>[numéro de l'écran]</span></b>
      </div>
      <div style={styles.centered}>
        {
          !isModify ?
            <div style={styles.centered}>
              <label style={styles.label}>Mot de passe</label>
              <input ref={passwordRef} type="password" style={styles.input}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  Meteor.call('check_password', value, (err, ans) => {
                    setIsAllowed(ans);
                    if(ans) {
                      passwordRef.current.value = '';
                    }
                  });
                }}
              />
            </div>
          :
            <div style={styles.centered}>
              <label style={styles.label}>Mot de passe admin.</label>
              <input type="password" style={styles.input} value={oldPass}
                onChange={({ currentTarget: { value } }) => {
                  setOldPass(value);
                }}
              />
              <label style={{...styles.label, marginTop: 20}}>Nouveau mot de passe</label>
              <input type="password" style={styles.input} value={newPass}
                onChange={({ currentTarget: { value } }) => {
                  setNewPass(value);
                }}
              />
              <button style={styles.button}
                onClick={() => {
                  Meteor.call('change_password', oldPass, newPass, (err, ans) => {
                    console.log(ans);
                    if(ans) {
                      setOldPass('');
                      setNewPass('');
                      setIsModify(false);
                      setIsAllowed(true);
                    }
                  });
                }}
              >Modifier le mot de passe</button>
            </div>
        }
        {
          !isModify ?
            <a href='#' style={{marginTop: 30, color: 'rgba(255, 255, 255, 0.6)'}}
              onClick={() => {
                setIsModify(true);
              }}
            >Changer Mot de passe</a>
          :
            <a href='#' style={{marginTop: 30, color: 'rgba(255, 255, 255, 0.6)'}}
              onClick={() => {
                setIsModify(false);
              }}
            >Se connecter</a>
        }
      </div>
    </div>
  );
};

export default PasswordPannel;

const styles = {
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10
  },
  centered: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    display: 'block',
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.6)'
  },
  input: {
    display: 'block',
    fontSize: 22,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 3,
    outline: 'none'
  },
  button: {
    marginTop: 30,
    fontSize: 14,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    border: `1px solid ${Colors.border.primary}`,
    outline: 'none'
  }
}