// Persistent Voter Token Utility for preventing duplicate votes
const VOTER_TOKEN_KEY = 'po3_voter_token';

export function getVoterToken() {
  try {
    let token = localStorage.getItem(VOTER_TOKEN_KEY);
    if (!token) {
      token = 'voter_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
      localStorage.setItem(VOTER_TOKEN_KEY, token);
    }
    return token;
  } catch {
    return 'anon_' + Date.now();
  }
}
