import React from 'react';
import {
  Box,
  Stepper as MuiStepper,
  Step,
  StepLabel,
  StepContent,
  StepButton,
  Button,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Check as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const Stepper = ({
  steps = [],
  activeStep = 0,
  completed = {},
  errors = {},
  warnings = {},
  onChange,
  onComplete,
  orientation = 'horizontal',
  variant = 'standard',
  alternativeLabel = false,
  showButtons = true,
  linear = true,
  nextButtonText = '다음',
  backButtonText = '이전',
  completeButtonText = '완료',
  sx = {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 모바일에서는 세로 방향으로 변경
  const effectiveOrientation = isMobile ? 'vertical' : orientation;

  // 스텝 상태에 따른 아이콘 반환
  const getStepIcon = (index) => {
    if (completed[index]) {
      return (
        <CheckIcon
          sx={{
            color: theme.palette.success.main
          }}
        />
      );
    }
    if (errors[index]) {
      return (
        <ErrorIcon
          sx={{
            color: theme.palette.error.main
          }}
        />
      );
    }
    if (warnings[index]) {
      return (
        <WarningIcon
          sx={{
            color: theme.palette.warning.main
          }}
        />
      );
    }
    return null;
  };

  // 스텝 상태에 따른 스타일 반환
  const getStepStyle = (index) => {
    if (completed[index]) {
      return {
        '& .MuiStepLabel-root .Mui-completed': {
          color: theme.palette.success.main
        }
      };
    }
    if (errors[index]) {
      return {
        '& .MuiStepLabel-root .Mui-error': {
          color: theme.palette.error.main
        }
      };
    }
    if (warnings[index]) {
      return {
        '& .MuiStepLabel-label': {
          color: theme.palette.warning.main
        }
      };
    }
    return {};
  };

  // 다음 스텝으로 이동
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      if (onComplete) {
        onComplete();
      }
    } else {
      onChange(activeStep + 1);
    }
  };

  // 이전 스텝으로 이동
  const handleBack = () => {
    onChange(activeStep - 1);
  };

  // 특정 스텝으로 이동
  const handleStep = (step) => {
    if (!linear || completed[step - 1] || step < activeStep) {
      onChange(step);
    }
  };

  return (
    <Box sx={sx}>
      <MuiStepper
        activeStep={activeStep}
        orientation={effectiveOrientation}
        alternativeLabel={alternativeLabel && !isMobile}
        nonLinear={!linear}
      >
        {steps.map((step, index) => (
          <Step
            key={step.label}
            completed={completed[index]}
            sx={getStepStyle(index)}
          >
            {variant === 'clickable' ? (
              <StepButton
                onClick={() => handleStep(index)}
                optional={
                  step.optional && (
                    <Typography variant="caption">
                      {step.optional}
                    </Typography>
                  )
                }
              >
                {step.label}
              </StepButton>
            ) : (
              <StepLabel
                StepIconComponent={getStepIcon(index)}
                error={!!errors[index]}
                optional={
                  step.optional && (
                    <Typography variant="caption">
                      {step.optional}
                    </Typography>
                  )
                }
              >
                {step.label}
              </StepLabel>
            )}
            {effectiveOrientation === 'vertical' && (
              <StepContent>
                {step.content}
                {showButtons && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mr: 1 }}
                    >
                      {activeStep === steps.length - 1
                        ? completeButtonText
                        : nextButtonText}
                    </Button>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                    >
                      {backButtonText}
                    </Button>
                  </Box>
                )}
              </StepContent>
            )}
          </Step>
        ))}
      </MuiStepper>

      {effectiveOrientation === 'horizontal' && showButtons && (
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            {backButtonText}
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            variant="contained"
            onClick={handleNext}
          >
            {activeStep === steps.length - 1
              ? completeButtonText
              : nextButtonText}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Stepper;