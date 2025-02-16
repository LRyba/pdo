import { Box, Typography, ThemeProvider, Button, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { lightTheme } from './components/Theme';
import { questions } from './helpers/questions';
import { coupons } from './helpers/coupons';

interface Question { question: string; tags: string[]; }

function App() {
  const [page, setPage] = useState<'HOME' | 'QUESTIONS' | 'RESULT'>('HOME');
  const [couponType, setCouponType] = useState<'ZACHCIANKA' | 'ŻĄDANIE'>('ZACHCIANKA');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentCoupon, setCurrentCoupon] = useState<any>(null);

  const handleCategorySelection = (category: string) => {
    setSelectedCategory(category);
    let questionsPool: Question[] = [];
    if (category === 'skadMamWiedziec') questionsPool = [...questions.jedzonko, ...questions.rozrywka, ...questions.relaksik];
    else if (category === 'jedzonko') questionsPool = questions.jedzonko;
    else if (category === 'rozrywka') questionsPool = questions.rozrywka;
    else if (category === 'relaksik') questionsPool = questions.relaksik;
    const shuffled = questionsPool.sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled.slice(0, 5));
    setQuestionIndex(0);
  };

  const handleAnswer = (answer: boolean) => {
    const currentQuestion = selectedQuestions[questionIndex];
    if (answer) setSelectedTags(prev => [...prev, ...currentQuestion.tags]);
    questionIndex < 4 ? setQuestionIndex(questionIndex + 1) : setPage('RESULT');
  };

  const getBestCoupon = () => {
    if (!selectedTags.length) return null;
    const couponMatches = coupons.map(coupon => ({ coupon, matchCount: coupon.tags.filter(tag => selectedTags.includes(tag)).length }));
    const maxMatch = Math.max(...couponMatches.map(m => m.matchCount));
    let bestCoupons
    if (currentCoupon) {
      bestCoupons = couponMatches.filter(m => m.matchCount === maxMatch && maxMatch > 0 && m.coupon.name !== currentCoupon.name).map(m => m.coupon);
    }
    else {
      bestCoupons = couponMatches.filter(m => m.matchCount === maxMatch && maxMatch > 0).map(m => m.coupon);
    }
    return bestCoupons.length ? bestCoupons[Math.floor(Math.random() * bestCoupons.length)] : null;
  };

  useEffect(() => { if (page === 'RESULT') setCurrentCoupon(getBestCoupon()); }, [page]);

  return (
    <ThemeProvider theme={lightTheme}>
      <Box display="flex" justifyContent="center" minHeight="100vh" bgcolor="#E5E4D7">
        <Stack display="flex" flexDirection="column" justifyContent="start" alignItems="center" margin="2rem 1rem" spacing={2}>
          <Typography variant="h2" color="secondary" textAlign="center" fontFamily="vintages">KUPONIK</Typography>
          {page === 'HOME' && (
            <>
              <img src={process.env.PUBLIC_URL + "/pics/bubu_thinking.png"} style={{ height: '20rem' }} alt="Bubu myśli" />
              <Typography variant="h5" color="secondary" textAlign="center" fontFamily="nyala">Mam dziś ochotę na...</Typography>
              <Stack spacing={2}>
                <Button variant="contained" color="primary" sx={{ fontSize: "2rem", fontFamily: "nyala" }} size="large" onClick={() => { setPage('QUESTIONS'); setCouponType('ZACHCIANKA'); }}>Zachcianke <img src={process.env.PUBLIC_URL + "/pics/bubu_want.png"} style={{ height: '3rem', marginLeft: '2px' }} alt="Chce" /></Button>
                <Button variant="contained" color="primary" sx={{ fontSize: "2rem", fontFamily: "nyala" }} size="large" onClick={() => { setPage('QUESTIONS'); setCouponType('ŻĄDANIE'); }}>Żądanie <img src={process.env.PUBLIC_URL + "/pics/bubu_demand.png"} style={{ height: '3rem', marginLeft: '2px' }} alt="Żąda" /></Button>
              </Stack>
            </>
          )}
          {page === 'QUESTIONS' && (
            <>
              {!selectedCategory ? (
                <>
                  <Typography variant="h5" color="secondary" textAlign="center" fontFamily="nyala">A konkretniej na...</Typography>
                  <Stack spacing={4} marginTop="2rem">
                    <Button variant="contained" color="primary" sx={{ fontSize: "2rem", fontFamily: "nyala" }} size="large" onClick={() => handleCategorySelection('jedzonko')}>Jedzonko <img src={process.env.PUBLIC_URL + "/pics/bubu_eat.png"} style={{ height: '3.5rem', marginLeft: '2px' }} alt="Jedzenie" /></Button>
                    <Button variant="contained" color="primary" sx={{ fontSize: "2rem", fontFamily: "nyala" }} size="large" onClick={() => handleCategorySelection('rozrywka')}>Rozrywkę <img src={process.env.PUBLIC_URL + "/pics/bubu_fun.png"} style={{ height: '3.5rem', marginLeft: '2px' }} alt="Rozrywka" /></Button>
                    <Button variant="contained" color="primary" sx={{ fontSize: "2rem", fontFamily: "nyala" }} size="large" onClick={() => handleCategorySelection('relaksik')}>Relaksik <img src={process.env.PUBLIC_URL + "/pics/bubu_relax.png"} style={{ height: '3.5rem', marginLeft: '2px' }} alt="Relaks" /></Button>
                    <Button variant="contained" color="primary" sx={{ fontSize: "2rem", fontFamily: "nyala" }} size="large" onClick={() => handleCategorySelection('skadMamWiedziec')}>Skąd mam wiedzieć?! <img src={process.env.PUBLIC_URL + "/pics/bubu_angry.png"} style={{ height: '3.5rem', marginLeft: '2px' }} alt="Nie wiem" /></Button>
                  </Stack>
                </>
              ) : (
                <Box paddingTop="10rem" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                  <Typography variant="h4" color="secondary" textAlign="center" fontFamily="nyala">{selectedQuestions[questionIndex].question}</Typography>
                  <Stack spacing={2} marginTop="2rem" direction="row">
                    <Button variant="contained" color="primary" sx={{ fontSize: "2rem", fontFamily: "nyala" }} size="large" onClick={() => handleAnswer(true)}>Tak</Button>
                    <Button variant="contained" color="primary" sx={{ fontSize: "2rem", fontFamily: "nyala" }} size="large" onClick={() => handleAnswer(false)}>Nie</Button>
                  </Stack>
                  <Typography variant="h6" color="secondary" textAlign="center" fontFamily="nyala">Pytanie {questionIndex + 1} z 5</Typography>
                </Box>
              )}
            </>
          )}
          {page === 'RESULT' && (
            <>
              {couponType === 'ZACHCIANKA' ? (
                <Typography variant="h5" color="secondary" textAlign="center" fontFamily="nyala">Dziś masz ochotę na...</Typography>
              ) : (
                <Typography variant="h5" color="secondary" textAlign="center" fontFamily="nyala">Dziś żądasz...</Typography>
              )}
              {currentCoupon ? (
                <>
                  <Typography variant="h4" color="secondary" textAlign="center" fontFamily="nyala">{currentCoupon.name}</Typography>
                  <img src={process.env.PUBLIC_URL + "/pics/" + currentCoupon.picture} style={{ height: '15rem', border: '3px solid #2C6700', borderRadius: '3px' }} alt={currentCoupon.name} />
                  <Typography variant="h5" color="secondary" textAlign="center" fontFamily="nyala">{currentCoupon.description}</Typography>
                </>
              ) : (
                <Typography variant="h5" color="secondary" textAlign="center" fontFamily="nyala">Brak dopasowania, spróbuj ponownie.</Typography>
              )}
              <Stack spacing={2} marginTop="1rem" direction="column">
                <Button variant="contained" color="primary" sx={{ fontSize: "2rem", fontFamily: "nyala" }} onClick={() => setCurrentCoupon(getBestCoupon())}>Coś innego!</Button>
                <Button variant="contained" color="primary" sx={{ fontSize: "2rem", fontFamily: "nyala" }} onClick={() => { setPage('HOME'); setSelectedCategory(null); setSelectedQuestions([]); setQuestionIndex(0); setSelectedTags([]); setCurrentCoupon(null); }}>Zacznij od nowa</Button>
              </Stack>
            </>
          )}
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

export default App;
